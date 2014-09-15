define(
    ['canjs', 'modules/covers/images', 'modules/covers/colors'],

    function (can, Images, Colors) {
        return can.Control.extend({
            defaults: {
                viewpath: 'app/modules/covers/views/'
            }
        }, {
            init: function () {

                var self = this,
                    options = self.options;

                self.element.html(
                    can.view(options.viewpath + 'index.stache', {})
                );

                new Images( self.element.find('.images'), {
                    viewpath: options.viewpath
                });

                new Colors( self.element.find('.colors'), {
                    viewpath: options.viewpath
                });

            }
        });
    }
);
