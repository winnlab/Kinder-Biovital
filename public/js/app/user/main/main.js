define(
    ['canjs', 'core/appState'],

    function (can, appState) {

        return can.Control.extend({
            defaults: {
                viewpath: 'app/main/views/'
            }
        }, {

            init: function () {

                var options = this.options;

                this.element.html(can.view(options.viewpath + 'index.stache', appState));

                if (options.isReady) {
                    options.isReady.resolve()
                }

            }

        });

    }
);
