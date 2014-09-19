define(
    [
        'canjs',
        'underscore',
        'lib/viewport',
        'modules/tales/talesModel',
        'modules/tales/taleConfig'
    ],

    function (can, _, viewport, TalesModel, taleConfig) {

        'use strict';

        var vendors = ['-webkit-', '-moz-', '-ms-', '-o-', ''];

        return can.Control.extend({
            defaults: {
                viewpath: '/js/app/admin/modules/tales/views/',
                viewName: 'preview.stache',
                // which frame show while init tale preview
                frameIndex: 0,
                // Player timeout
                timeOut: 5000
            }
        }, {

            init: function () {
                _.extend(this.options, taleConfig);
                var self = this,
                    def = can.Deferred(),
                    options = this.options,
                    html;

                self.playInterval = null;

                self.module = new can.Map({
                    cIndex: self.options.frameIndex + 1,
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
                    }
                });

                can.ajax({url: '/tale/' + this.options.taleId})
                .done(function(data){
                    self.module.attr('tale', data.data);
                    def.resolve();
                });

                can.when(def)
                    .then(function () {
                        self.currentFrame(self.options.frameIndex);
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
