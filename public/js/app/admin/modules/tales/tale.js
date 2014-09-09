define(
    ['canjs', 'underscore', 'core/appState', 'lib/jquerypp'],

    function (can, _, appState) {

        'use strict';

        var Module = can.Map.extend({
                showText: false,
                setBg: function (context, el, ev) {
                    this.attr('frame.decorationId', context.attr('_id'));
                },
                setText: function (scope, el, ev) {
                    this.attr('frame.text', el.val());
                }
            }),
            vendors = ['-webkit-', '-moz-', '-ms-', '-o-', ''];

        return can.Control.extend({
            defaults: {
                viewpath: 'app/modules/tales/views/',
                viewName: 'set.stache',
                // can be "bg", "frame", "cover"
                display: 'frame',

                frame: null,
                // Proportion of frame background and mini frame
                miniProp: 9.69895288,
                // This is offset of tale backround from tale zone
                frameBgTop: -275,

                data: [
                    'display',
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
                    // this.module.attr('display', 'bg');
                }

                this.currentFrame();

                html = can.view(options.viewpath + options.viewName, this.module, {
                    sizeContainer: function () {
                        document.body.scrollTop = 50;
                        return '';
                    },
                    bgOffset: function (left) {
                        var css = '';
                        for (var i = vendors.length; i--; ) {
                            css += vendors[i] + 'transform: translateX(-' + left() + 'px);';
                        }
                        return css;
                    },
                    miniOffset: function (left) {
                        return 'left: ' + Math.round(left() / options.miniProp) + 'px';
                    },
                    getPreview: function(decorationId, decorations) {
                        var preview = '';
                        decorations = decorations().attr();
                        decorationId = decorationId();
                        for (var i = decorations.length; i--; ) {
                            if (decorationId == decorations[i]._id) {
                                preview = decorations[i].preview;
                            }
                        }

                        return preview ? 'background-image: url("/uploads/' + preview + '");' : '';
                    },
                    heroSize: function (options) {
                        var width = 150,
                            height = 150,
                            zIndex = 3;
                        return 'width: ' + width + 'px; height: ' + height + 'px; z-index: ' + zIndex;
                    }
                });

                this.element.html(html);

            },


            /**
             * Seting default data to empty tale
             */
            setDefaults: function (doc, options) {
                doc.attr({
                    frames: [this.addFrame(0)],
                    type: 0
                });
            },

            addFrame: function (index) {
                return {
                    decorationId: this.options.decorations.attr('0._id'),
                    name: 'Слайд ' + (index + 1),
                    text: '',
                    left: 1240,
                    heroes: []
                }
            },

            currentFrame: function (index) {
                var module = this.module;
                index = index || 0;
                module.attr('frame', module.attr('tale').attr('frames.' + index));
            },

            '.miniFrame draginit': function (el, ev, drag) {
                drag.limit(el.parent());
                drag.horizontal();
            },

            '.miniFrame dragmove': function (el, ev, drag) {
                if (drag.required_css_position) {
                    this.setFrameLeft(drag.required_css_position['0']);
                }
            },

            '.miniFrame dragend': function (el, ev, drag) {
                this.setFrameLeft(drag.required_css_position['0']);
            },

            setFrameLeft: function (miniLeft) {
                var left = ~~(this.options.miniProp * miniLeft),
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
                    offset = el.offset(),
                    left = drag.location.left() - offset.left + this.module.attr('frame.left'),
                    top = drag.location.top() - offset.top - this.options.frameBgTop;
                this.addHero(heroId, left, top);
            },

            addHero: function (id, left, top) {
                var module = this.module,
                    heroes = module.attr('heroes'),
                    hero = _.find(heroes, function (h) {
                        return h.attr('_id') === id;
                    });

                module.attr('frame.heroes').push({
                    heroId: id,
                    img: hero.attr('img'),
                    left: left,
                    top: top,
                    name: '',
                    replica: {
                        replicaId: module.attr('replica.0._id'),
                        left: left + 100,
                        top: top - 30,
                        text: ''
                    }
                });
            },

            '.heroIn click': function () {
                console.log(module.attr('frame.heroes').attr());
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
            }

        });

    }
);
