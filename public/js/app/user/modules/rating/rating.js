define(
    [
        'canjs',
        'modules/tales/talesModel',
        'core/appState'
    ],

    function (can, TalesModel, appState) {

        return can.Control.extend({
            defaults: {
                viewpath: 'app/modules/rating/views/'
            }
        }, {
            init: function () {
                var self = this,
                    options = self.options;

                TalesModel.findAll({type: 1}, function (tales) {

                    self.element.html(can.view(options.viewpath + 'index.stache', {
                            tales: tales,
                            appState: appState
                        })
                    );

                    if (options.isReady) {
                        options.isReady.resolve();
                    }
                });
            }
        });

    }
);
