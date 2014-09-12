define(
    ['canjs', 'modules/tales/talePreview', 'core/appState'],

    function (can, TalePreview, appState) {

        return can.Control.extend({
            defaults: {
                viewpath: 'app/tale/views/'
            }
        }, {
            init: function () {
                var self = this,
                    options = self.options,
                    taleId = self.element.attr('id').replace('fairy-tale-', ''),
                    html = can.view(options.viewpath + 'tale.stache', appState, function (frag) {
                        self.element.html(frag);

                        new TalePreview(self.element.find('.talePreview'), {
                            taleId: taleId,
                            isReady: options.isReady
                        });
                    });
            }
        });

    }

);
