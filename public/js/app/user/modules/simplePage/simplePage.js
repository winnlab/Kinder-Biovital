define(
    [
        'canjs',
        'core/appState',
        'components/listSlider/listSlider'
    ],

    function (can, appState) {

        return can.Control.extend({
            defaults: {
                viewpath: '/js/app/user/modules/simplePage/views/'
            }
        }, {

            init: function () {
                var self = this,
                    lang = appState.attr('lang'),
                    link = can.route.attr('id');

                self.watchVideo = can.compute(false);

                can.ajax({
                    url: (lang ? '/' + lang : '') + '/page/' + link
                }).done(function (page) {
                    can.view(self.options.viewpath + (page.data.view ? page.data.view : 'index') + '.stache', {
                        appState: appState,
                        watchVideo: self.watchVideo,
                        page: page.data
                    }, function (fragment) {
                        self.element.html(fragment);
                        self.element.find('video').on('ended', function() {
                            self.watchVideo(false);
                        });
                    });
                    self.loaded();
                }).fail(function () {
                    self.loaded();
                });

            },

            loaded: function () {
                var self = this;
                if (self.options.isReady) {
                    self.options.isReady.resolve();
                }
            },

            '.watchIntro click': function () {
                var self = this;
                self.watchVideo(true);
                self.element.find('video')[0].play();
            },

            '.closeFrame click': 'pauseVideo',

            '.backToText click': 'pauseVideo',

            pauseVideo: function () {
                var self = this,
                    video = self.element.find('video');

                if (video.length) {
                    self.watchVideo(false);
                    video[0].pause();
                }
            }

        });

    }
);
