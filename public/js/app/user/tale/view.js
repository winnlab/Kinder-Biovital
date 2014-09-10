define(
    ['canjs', 'modules/tales/talePreview', 'core/appState'],

    function (can, TalePreview, appState) {

        return can.Control.extend({
            defaults: {
                viewpath: 'app/tale/views/',
                taleId: '540ff58d88badf1343e1128c'
            }
        }, {
            init: function () {
                var self = this,
                    options = self.options,
                    html = can.view(options.viewpath + 'tale.stache', appState, function (frag) {
                        self.element.html(frag);

                        new TalePreview(self.element.find('.talePreview'), {
                            taleId: options.taleId,
                            isReady: options.isReady
                        });
                    });
            }
        });

    }

);
