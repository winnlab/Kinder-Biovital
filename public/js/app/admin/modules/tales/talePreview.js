define(
    [
        'canjs',
        'underscore',
        'lib/viewport',
        'modules/tales/talesModel',
        'modules/tales/taleConfig',
        'core/appState'
    ],

    function (can, _, viewport, TalesModel, taleConfig, appState) {

        'use strict';

        var vendors = ['-webkit-', '-moz-', '-ms-', '-o-', ''];

        return can.Control.extend({
            defaults: {
                viewpath: '/js/app/admin/modules/tales/views/',
                viewName: 'preview.stache',
                // which frame show while init tale preview
                frameIndex: 0,
                // Player timeout
                timeOut: 12000,
                // is the last page of tale 'Sharing'
                share: false
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
                    cIndex: options.frameIndex + 1,
                    tale: {},
                    frame: {},
                    playTrack: true,
                    showPause: false,
                    locale: appState.attr('locale'),
                    baseUrl: window.location.origin,

                    share: function (scope, el, ev) {
                        var self = this,
                            network = el.data('nw'),
                            tale = self.attr('tale'),
                            cover = tale.attr('cover'),
                            social = appState.attr('social'),
                            msg = tale.attr('type') == 1 ? appState.attr('locale.shareUser') : appState.attr('locale.shareCompany');

                        social.provider(network).share({
                            msg: msg.format(tale.attr('name')),
                            link: window.location.origin + '/fairy-tale/' + tale.attr('_id'),
                            img: window.location.origin + (cover ? '/uploads/' + cover : '/img/favicon.png'),
                            taleId: tale.attr('_id')
                        }, function (postId) {
                            // do something
                        });
                    }
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
                    if (options.share && data.data.type == 1) {
                        self.addShareFrame();
                    }
                    def.resolve();
                });

                can.when(def)
                    .then(function () {
                        self.currentFrame(self.options.frameIndex);
                        self.element.html(html);
                        self.playTrack();


                        var tale = self.module.attr('tale'),
                            id = tale.attr('_id'),
                            cover = tale.attr('cover');
                        if (options.share && tale.attr('type') == 1) {
                            appState.attr('social').makeLike('like-' + id, {
                                'title': tale.attr('name'),
                                'desc': 'Мне понравилась сказка "' + tale.attr('name') + '"',
                                'url': window.location.origin + '/like/' + id,
                                'image': window.location.origin + (cover ? '/uploads/' + cover : '/img/favicon.png')
                            });
                        }

                        appState.attr('social').getProvider('ok').makeShare('ok-share-' + id, {
                            'url': window.location.origin + '/like/' + id
                        })

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

            addShareFrame: function () {
                var frames = this.module.attr('tale.frames'),
                    shareFrame = {};

                _.extend(shareFrame, frames.attr(frames.length - 1).attr());

                shareFrame.text = '';
                shareFrame.heroes = [];
                shareFrame.share = true;

                frames.push(shareFrame);
            },

            '.prevFrame click': function () {
                this.changeFrame(-1);
                this.module.attr('showPause', false);
                clearInterval(this.playInterval);
            },

            '.nextFrame click': function () {
                this.changeFrame(1);
                this.module.attr('showPause', false);
                clearInterval(this.playInterval);
            },

            '.playFrame click': function (el) {
                var self = this;
                if (self.module.attr('showPause')) {
                    clearInterval(self.playInterval);
                    self.module.attr('showPause', false);
                } else {
                    self.module.attr('showPause', true);
                    self.playInterval = setInterval(function () {
                        self.changeFrame(1);
                    }, self.options.timeOut);
                }
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
                    module.attr('showPause', false);
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
