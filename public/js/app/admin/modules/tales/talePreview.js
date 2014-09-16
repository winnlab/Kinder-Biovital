define(
    [
        'canjs',
        'underscore',
        'lib/viewport',
        'modules/tales/talesModel'
    ],

    function (can, _, viewport, TalesModel) {

        'use strict';

        var vendors = ['-webkit-', '-moz-', '-ms-', '-o-', ''];

        return can.Control.extend({
            defaults: {
                viewpath: '/js/app/admin/modules/tales/views/',
                viewName: 'preview.stache',

                // This is offset of tale backround from tale zone
                frameBgTop: -275,
                // the offset top of hero when it become bigger
                firstPlanTop: 500,

                decorationWidth: 3705,

                heroSize: {
                    fgWidth: 190,
                    fgHeight: 240,
                    bgWidth: 120,
                    bgHeight: 150
                },

                queryBase: '/admin',

                timeOut: 5000,

                taleSize: {
                    width: 1225,
                    height: 650
                }
            }
        }, {

            init: function () {

                var self = this,
                    def = can.Deferred(),
                    options = this.options,
                    html;

                self.playInterval = null;

                self.module = new can.Map({
                    cIndex: 1,
                    tale: {},
                    frame: {},
                    playTrack: true
                });

                html = can.view(options.viewpath + options.viewName, this.module, {
                    contentSize: function (size) {
                        var height = viewport.getViewportHeight() + 'px';
                        self.element.css('min-height', height);
                        return 'min-height: ' + height;
                    },
                    talePosition: function () {
                        var left = (viewport.getViewportWidth() - self.options.taleSize.width) / 2,
                            top = (viewport.getViewportHeight() - 650) / 2;

                        return 'left: ' + left + 'px; top: ' + top + 'px';;
                    },
                    bgOffset: function (left) {
                        var css = '';
                        var winWidth = viewport.getViewportWidth(),
                            taleWidth = self.options.taleSize.width,
                            taleOffset = (winWidth - taleWidth) / 2,
                            decWidth = self.options.decorationWidth,
                            left = left();

                        if (left < taleOffset) {
                            left = taleOffset + 1;
                        }

                        if ((decWidth - left) < (taleWidth + taleOffset * 2)) {
                            left = decWidth - (taleWidth + taleOffset * 2);
                        }

                        for (var i = vendors.length; i--; ) {
                            css += vendors[i] + 'transform: translateX(-' + left + 'px);';
                        }
                        return css;
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

                can.ajax({url: '/tale/' + this.options.taleId})
                .done(function(data){
                    self.module.attr('tale', data.data);
                    def.resolve();
                });

                can.when(def)
                    .then(function () {
                        self.currentFrame();
                        self.element.html(html);
                        self.playTrack();

                        if (options.isReady) {
                            options.isReady.resolve();
                        }
                    });

            },

            currentFrame: function (index) {
                var module = this.module;
                index = index || 0;
                module.attr('frame', module.attr('tale').attr('frames.' + index));
            },

            '.prevFrame click': function () {
                this.changeFrame(-1);
                clearInterval(this.playInterval);
            },

            '.nextFrame click': function () {
                this.changeFrame(1);
                clearInterval(this.playInterval);
            },

            '.playFrame click': function () {
                var self = this;

                self.playInterval = setInterval(function () {
                    self.changeFrame(1);
                }, self.options.timeOut);
            },

            changeFrame: function (i) {
                var module = this.module,
                    frames = module.attr('tale.frames'),
                    frame = module.attr('frame'),
                    cIndex = frames.indexOf(frame),
                    index = cIndex + i;
                if (index >= 0 && index < frames.length) {
                    module.attr('cIndex', index + 1);
                    this.currentFrame(index);
                } else {
                    clearInterval(this.playInterval);
                }
            },

            playTrack: function () {
                var $track = $('#track' + this.module.attr('tale._id'));
                if ($track.length) {
                    $track[0].volume = 0.4;
                    $track[0].play();
                }
            },

            pauseTrack: function () {
                var $track = $('#track' + this.module.attr('tale._id'));
                if ($track.length) {
                    $track[0].pause();
                }
            },

            '.soundBtn click': function () {
                var played = this.module.attr('playTrack');

                if (played) {
                    this.pauseTrack();
                } else {
                    this.playTrack();
                }

                this.module.attr('playTrack', !played);
            },

            '{closePreview} click': function () {                
                this.pauseTrack();
            }


        });

    }
);
