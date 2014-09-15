define(
    [
        'canjs',
        'underscore',
        'core/appState',
        'lib/viewport',
        'modules/tales/talePreloader',
        'modules/tales/talePreview',
        'lib/jquerypp',
        'components/itemScroll/itemScroll'
    ],

    function (can, _, appState, viewport, Preloader, TalePreview) {

        'use strict';

        var Module = can.Map.extend({
                showText: false,
                showTracks: false,
                talePreview: '',
                interface: 'big',
                locale: appState.attr('locale'),
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
                },
                setTrack: function (context, el, ev) {
                    this.attr('tale.trackId', context.attr('_id'));
                    this.attr('showTracks', false);
                }
            }),
            vendors = ['-webkit-', '-moz-', '-ms-', '-o-', ''];

        return can.Control.extend({
            defaults: {
                viewpath: '/js/app/admin/modules/tales/views/',
                viewName: 'set.stache',
                // can be "bg", "frame", "cover", "share"
                display: 'frame',                

                frame: null,
                // Proportion of frame background and mini frame
                realProp: 9.69895288,
                miniProp: 11.724683544,
                // This is offset of tale backround from tale zone
                frameBgTop: -275,
                // the offset top of hero when it become bigger
                firstPlanTop: 500,
                // the minimal amount of left frameBg offset in pixels
                frameBgMinOffset: 348,

                taleSize: {
                    width: 1224,
                    height: 650
                },

                heroSize: {
                    fgWidth: 190,
                    fgHeight: 240,
                    bgWidth: 120,
                    bgHeight: 150
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
                    'heroes'
                ]
            }
        }, {

            init: function () {

                var self = this,
                    options = this.options,
                    html;

                self.module = new Module();

                for (var i = options.data.length; i-- ;) {
                    self.module.attr(options.data[i], options[options.data[i]]);
                }

                if (options.tale.isNew()) {
                    self.setDefaults(options.tale, options);
                }

                self.currentFrame();

                html = can.view(options.viewpath + options.viewName, self.module, {
                    contentSize: function (size) {
                        var height = viewport.getViewportHeight() + 'px';
                        self.element.css('min-height', height);
                        return 'min-height: ' + height;
                    },
                    talePosition: function () {
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
                    },
                    getReplicaTail: function (options) {
                        var hero = options.context,
                            heroTop = hero.attr('top'),
                            heroLeft = hero.attr('left'),
                            sizePrefix = heroTop > self.options.firstPlanTop ? 'fg' : 'bg',
                            heroWidth = self.options.heroSize[sizePrefix + 'Width'],
                            heroHeight = self.options.heroSize[sizePrefix + 'Height'],
                            replicaClass = '';

                        if ((heroLeft + heroWidth / 2) > hero.attr('replica.left')) {
                            replicaClass += 'L';
                        } else {
                            replicaClass += 'R';
                        }

                        if ((heroTop + heroHeight / 2) > hero.attr('replica.top')) {
                            replicaClass += 'T';
                        } else {
                            replicaClass += 'B';
                        }

                        return replicaClass;
                    }
                });

                self.element.html(html);

                if (options.isReady) {
                    Preloader.preload(self.module.attr(), options.isReady.resolve);
                }

            },

            /**
             * Seting default data to empty tale
             */
            setDefaults: function (doc, options) {
                doc.attr({
                    frames: [this.addFrame(0)],
                    left: 150,
                    top: 50
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
                        left: null,
                        top: null,
                        text: ''
                    }
                });
            },

            '.heroInDrag draginit': function (el, ev, drag) {
                drag.limit(el.parents('.taleZone'));
            },

            '.heroInDrag dragmove': 'setHeroPosition',

            '.heroInDrag dragend': 'setHeroPosition',

            '.displayFrame .replica draginit': function (el, ev, drag) {
                drag.limit(el.parents('.taleZone'));
            },

            '.displayFrame .replica dragend': 'setReplicaPosition',

            setHeroPosition: function (el, ev, drag) {
                this.setHeroDragged(el, null, drag);
            },

            setReplicaPosition: function (el, ev, drag) {
                this.setHeroDragged(el, 'replica', drag);
            },

            setHeroDragged: function (el, attr, drag) {
                var offset = el.parents('.taleZone').offset(),
                    leftInContainer = drag.location.left() - offset.left,
                    topInContainer = drag.location.top() - offset.top,
                    hero = attr ? el.parents('.heroInDrag').data('hero') : el.data('hero'),
                    left = leftInContainer + this.module.attr('frame.left'),
                    top = topInContainer - this.options.frameBgTop;

                if (attr) {
                    hero.attr(attr).attr({
                        left: left,
                        top: top
                    });
                } else {
                    var oldTop = hero.attr('top'),
                        oldLeft = hero.attr('left'),
                        replicaTop = hero.attr('replica.top'),
                        replicaLeft = hero.attr('replica.left');

                    can.batch.start();

                    hero.attr({
                        left: left,
                        top: top
                    });
                    hero.attr('replica.top', replicaTop - (oldTop - top));
                    hero.attr('replica.left', replicaLeft - (oldLeft - left));

                    can.batch.stop();
                }
            },

            '.coverName draginit': function (el, ev, drag) {
                drag.limit(el.parent());
            },

            '.coverName dragend': function (el, ev, drag) {
                var offset = el.parents('.coverPreview').offset(),
                    left = drag.location.left() - offset.left,
                    top = drag.location.top() - offset.top;

                this.module.attr('tale.top', top);
                this.module.attr('tale.left', left);
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
                    hero.attr('replica.left', hero.attr('left') + 150);
                    hero.attr('replica.top', hero.attr('top') - 30);
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
            },

            '.showTracks click': function () {
                this.module.attr('showTracks', !this.module.attr('showTracks'));
            }

        });

    }
);
