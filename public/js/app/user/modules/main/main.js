define(
    ['canjs', 'core/appState', 'lib/preloader', 'lib/viewport', 'modules/tales/taleConfig'],

    function (can, appState, Preloader, viewport, taleConfig) {

        return can.Control.extend({
            defaults: {
                viewpath: 'app/modules/main/views/',
                bgSize: {
                    width: 1600,
                    height: 1200
                }
            }
        }, {

            init: function () {
                var self = this,
                    options = this.options;

                var Module = can.Map.extend({
                    define: {
                        bgOffset: {
                            get: function () {
                                if (this.attr('videoEnded')) {
                                    return - (this.attr('bgSize.height') - taleConfig.taleSize.height) / 2;
                                } else {
                                    return - this.attr('bgSize.height');
                                }
                            }
                        }
                    }
                });

                self.module = new Module({
                    locale: appState.attr('locale'),
                    size: appState.attr('size'),
                    videoEnded: false
                });

                self.getBgSize();

                self.element.html(can.view(options.viewpath + 'index.stache', self.module));

                if (options.isReady) {
                    new Preloader({
                        images: ['introTop.png', 'introBtm.png'],
                        folder: '/img/',
                        callback: function () {
                            options.isReady.resolve();
                            // self.element.find('video')[0].play();
                        }
                    });
                }

                // self.element.find('video').on('ended', function() {
                    self.module.attr('videoEnded', true);
                // });
            },

            '{window} resize': function () {
                this.getBgSize();
            },

            getBgSize: function () {
                var bgSize = this.options.bgSize,
                    ratio = this.getRatio(),
                    imgHeight = ~~(bgSize.height * ratio) + 1;

                this.module.attr('bgSize', {
                    width: viewport.getViewportWidth(),
                    height: imgHeight
                });
            },

            getRatio: function () {
                var winWidth = viewport.getViewportWidth(),
                    bgSize = this.options.bgSize;
                return winWidth / bgSize.width;
            }

        });

    }
);
