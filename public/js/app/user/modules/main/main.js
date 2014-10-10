define(
    ['canjs', 'core/appState', 'lib/preloader', 'lib/viewport', 'modules/tales/taleConfig', 'src/transition'],

    function (can, appState, Preloader, viewport, taleConfig, transition) {

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
                    options = this.options,
                    offset = $('#preloader img').offset();

                self.module = new can.Map({
                    appState: appState,
                    size: appState.attr('size'),
                    loaderPosition: {
                        left: offset.left,
                        top: offset.top
                    },
                    loaded: false
                });

                self.getBgSize();

                self.element.html(can.view(options.viewpath + 'index.stache', self.module, {
                    bgOffset: function () {
                            var height = this.attr('bgSize.height');
                            if (this.attr('loaded')) {
                                return - (height - taleConfig.taleSize.height) / 2;
                            } else {
                                return - height;
                            }
                    }
                }));

                if (options.isReady) {
                    new Preloader({
                        images: ['introTop.png', 'introBtm.png'],
                        folder: '/img/',
                        callback: function () {
                            options.isReady.resolve();
                            self.module.attr('loaded', true);
                            self.element.find('.bg img').one(transition(), function () {
                                $(this).addClass('animated')
                            });
                        }
                    });
                }

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
