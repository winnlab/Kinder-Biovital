define(
    [
        'canjs',
        'underscore',
        'core/appState',
        'lib/viewport',
        'modules/tales/talePreview',
        'lib/jquerypp',
        'components/itemScroll/itemScroll'
    ],

    function (can, _, appState, viewport, TalePreview) {

        'use strict';

        var Module = can.Map.extend({
                showText: false,
                talePreview: '',
                interface: 'big',
                admin: document.location.pathname.indexOf('admin/') !== -1,
                setBg: function (context, el, ev) {
                    this.attr('frame.decorationId', context.attr('_id'));
                    this.attr('frame.time', context.attr('time'));
                },
                setText: function (scope, el, ev) {
                    var text = el.val().slice(0, 200);
                    el.val(text);
                    this.attr('frame.text', text);
                },
                setReplica: function (scope, el, ev) {
                    var text = el.val().slice(0, 120);
                    el.val(text);
                    scope.attr('replica.text', el.val());
                }
            }),
            vendors = ['-webkit-', '-moz-', '-ms-', '-o-', ''];

        return can.Control.extend({
            defaults: {
                viewpath: '/js/app/admin/modules/tales/views/',
                viewName: 'set.stache',
                // can be "bg", "frame", "cover"
                display: 'frame',

                frame: null,
                // Proportion of frame background and mini frame
                realProp: 9.69895288,
                miniProp: 11.724683544,
                // This is offset of tale backround from tale zone
                frameBgTop: -275,
                // the offset top of hero when it become bigger
                firstPlanTop: 450,
                // the minimal amount of left frameBg offset in pixels
                frameBgMinOffset: 348,

                taleSize: {
                    width: 1224,
                    height: 650
                },

                data: [
                    'display',
                    'interface',
                    'frame',
                    'tale',
                    'tracks',
                    'coverColors',
                    'coverImages',
                    'decorations',
                    'heroes',
                    'replica'
                ]
            }
        }, {

            init: function () {

                var self = this,
                    options = this.options,
                    html;

                this.module = new Module();

                for (var i = options.data.length; i-- ;) {
                    this.module.attr(options.data[i], options[options.data[i]]);
                }

                if (options.tale.isNew()) {
                    this.setDefaults(options.tale, options);
                }

                this.currentFrame();

                html = can.view(options.viewpath + options.viewName, this.module, {
                    contentSize: function (size) {
                        var height = viewport.getViewportHeight() + 'px';
                        self.element.css('min-height', height);
                        return 'min-height: ' + height;
                    },
                    talePosition: function () {
                        document.body.scrollTop = 50;
                        var left = (viewport.getViewportWidth() - 1225) / 2,
                            top = (viewport.getViewportHeight() - 650) / 2;

                        return 'left: ' + left + 'px; top: ' + top + 'px';;
                    },
                    bgOffset: function (left) {
                        var css = '';
                        for (var i = vendors.length; i--; ) {
                            css += vendors[i] + 'transform: translateX(-' + left() + 'px);';
                        }
                        return css;
                    },
                    miniOffset: function (left) {
                        return 'left: ' + Math.round((left() - options.frameBgMinOffset / 2) / options.miniProp) + 'px';
                    },
                    heroPlan: function (options) {
                        return options.context.attr('top') > self.options.firstPlanTop
                            ? 'firstPlan'
                            : 'secondPlan';
                    }
                });

                this.element.html(html);

                if (options.isReady) {
                    options.isReady.resolve();
                }

            },

            /**
             * Seting default data to empty tale
             */
            setDefaults: function (doc, options) {
                doc.attr({
                    frames: [this.addFrame(0)]
                });
            },

            addFrame: function (index) {
                this.module.attr({
                    'showText': false
                    , 'display': 'bg'
                });

                var currentFrame = this.module.attr('frame'),
                    decoration,
                    frame = {};

                if (currentFrame) {
                    _.extend(frame, currentFrame.attr());
                    frame = this.clearingFrame(frame);
                } else {
                    decoration = this.options.decorations.attr('0');
                    frame = {
                        decorationId: decoration.attr('_id'),
                        time: decoration.attr('time'),
                        text: '',
                        left: 1240,
                        heroes: []
                    }
                }

                return frame;
            },

            clearingFrame: function (frame) {
                frame.text = '';
                for (var i = frame.heroes.length; i--;) {
                    frame.heroes[i].replica.text = '';
                }
                return frame;
            },

            currentFrame: function (index) {
                var module = this.module;
                index = index || 0;
                module.attr('frame', module.attr('tale').attr('frames.' + index));

                if (module.attr('frame.text').length === 0) {
                    module.attr('showText', false);
                } else {
                    module.attr('showText', true);
                }
            },

            '.miniFrame draginit': function (el, ev, drag) {
                drag.limit(el.parent());
                drag.horizontal();
            },

            '.miniFrame dragmove': 'setFrameLeft',

            '.miniFrame dragend': 'setFrameLeft',

            setFrameLeft: function (el, ev, drag) {
                if (!drag.required_css_position) {
                    return true;
                }
                var dragLeft = drag.required_css_position['0'],
                    frameBgMinOffset = this.options.frameBgMinOffset,
                    left = ~~(this.options.realProp * dragLeft + frameBgMinOffset),
                    module = this.module;

                if (left !== module.attr('frame.left')) {
                    module.attr('frame.left', left);
                }
            },

            '.hero draginit': function (el, ev, drag) {
                drag.ghost();
            },

            '.taleZone dropon': function (el, ev, drop, drag) {
                var heroId = drag.element.data('id'),
                    offset,
                    left,
                    top;
                if (heroId) {
                    offset = el.offset(),
                    left = drag.location.left() - offset.left + this.module.attr('frame.left'),
                    top = drag.location.top() - offset.top - this.options.frameBgTop;
                    this.addHero(heroId, left, top);
                }
            },

            addHero: function (id, left, top) {
                var module = this.module,
                    heroes = module.attr('heroes'),
                    hero = _.find(heroes, function (h) {
                        return h.attr('_id') === id;
                    });

                module.attr('frame.heroes').push({
                    heroId: id,
                    left: left,
                    top: top,
                    name: hero.attr('name'),
                    replica: {
                        replicaId: module.attr('replica.0._id'),
                        left: left + 100,
                        top: top - 30,
                        text: ''
                    }
                });
            },

            '.heroInDrag draginit': function (el, ev, drag) {
                drag.limit(el.parents('.taleZone'));
            },

            '.heroInDrag dragmove': 'setHeroPosition',

            '.heroInDrag dragend': 'setHeroPosition',

            setHeroPosition: function (el, ev, drag) {
                var taleSize = this.options.taleSize,
                    offset = el.parents('.taleZone').offset(),
                    leftInContainer = drag.location.left() - offset.left,
                    topInContainer = drag.location.top() - offset.top,
                    hero,
                    left,
                    top;

                if (leftInContainer >= 0
                    && topInContainer >= 0
                    && leftInContainer <= taleSize.width
                    && topInContainer <=  taleSize.height) {

                    hero = el.data('hero');
                    left = leftInContainer + this.module.attr('frame.left');
                    top = topInContainer - this.options.frameBgTop;
                    hero.attr({
                        left: left,
                        top: top
                    });
                } else {
                    return false;
                }
            },

            '[data-display] click': function (el) {
                this.module.attr('display', el.data('display'));
            },

            '.addTitr click': function () {
                this.module.attr('showText', true);
            },

            '.removeTitr click': function () {
                this.module.attr('showText', false);
                this.module.attr('frame.text', '');
            },

            '.frame click': function (el) {
                var index = el.data('index'),
                    frames = this.module.attr('tale.frames');

                if (!index && index !== 0) {
                    index = frames.length;
                    frames.push( this.addFrame(index) );
                }

                this.currentFrame(index);
            },

            '.removeSlide click': function () {
                var frames = this.module.attr('tale.frames'),
                    index = frames.indexOf(this.module.attr('frame')),
                    nextIndex = index - 1;

                if (frames.length > 1) {
                    if (nextIndex < 0) {
                        nextIndex = 1;
                    }
                    this.currentFrame(nextIndex);
                    frames.splice(index, 1);
                } else {
                    appState.attr('notification', {
                        status: 'error',
                        msg: 'Невозможно удалить последний слайд'
                    });
                }
            },

            '.replicaBtn click': function (el) {
                var hero = el.parents('.heroInDrag').data('hero');

                if (hero.attr('replica.text')) {
                    hero.attr('replica.text', '');
                } else {
                    hero.attr('replica.text', ' ');
                }
            },

            '.removeHero click': function (el) {
                var heroes = this.module.attr('frame.heroes'),
                    hero = el.parent().data('hero'),
                    index = heroes.indexOf(hero);

                heroes.splice(index, 1);
            },

            '.coverImage click': function (el) {
                this.module.attr('tale.coverImgId', el.data('id'));
            },

            '.coverColor click': function (el) {
                this.module.attr('tale.coverColorId', el.data('id'));
            },

            saveTale: function (cb, clearStorage) {
                var module = this.module;
                module.attr('tale').save()
                    .done(function () {
                        if (typeof cb === 'function') {
                            cb();
                        }
                    })
                    .fail(function () {
                        appState.attr('notification', {
                            status: 'error',
                            msg: 'Невозможно сохранить сказку'
                        });
                    });
            },

            '.preview click': function () {
                this.saveTale(can.proxy(function(){
                    var module = this.module;
                    this.element.find('.talePreviewWrap').html('<div class="talePreview"></div>');
                    this.module.attr('talePreview', true);
                    new TalePreview(this.element.find('.talePreview'), {
                        taleId: module.attr('tale._id')
                    });
                }, this));
            },

            '.end click': function () {
                this.saveTale(null, true);
                can.route.attr({module: 'tales'}, true);
            },

            '.closeFrame click': function (el) {
                if (el.hasClass('closePreview')) {
                    this.module.attr('talePreview', false);
                } else {
                    this.saveTale();
                    can.route.attr({module: 'tales'}, true);
                }
            }

        });

    }
);
