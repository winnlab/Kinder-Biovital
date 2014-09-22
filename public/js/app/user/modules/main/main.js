define(
    ['canjs', 'core/appState', 'src/social'],

    function (can, appState) {

        return can.Control.extend({
            defaults: {
                viewpath: 'app/modules/main/views/'
            }
        }, {

            init: function () {

                var options = this.options;
                console.log(appState.attr());
                this.element.html(can.view(options.viewpath + 'index.stache', appState));

                if (options.isReady) {
                    options.isReady.resolve()
                }

            }

        });

    }
);
