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

                can.ajax({
                    url: (lang ? '/' + lang : '') + '/page/' + link
                }).done(function (page) {
                    self.element.html(
                        can.view(self.options.viewpath + (page.data.view ? page.data.view : 'index') + '.stache', {
                            appState: appState,
                            page: page.data
                        })
                    );

                    if (self.options.isReady) {
                        self.options.isReady.resolve();
                    }
                });

            }

        });

    }
);
