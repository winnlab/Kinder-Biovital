define(
    [
        'canjs',
        'underscore',
        'modules/tales/talesModel',
        'core/appState',
        '/js/lib/malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.concat.min.js',
        'css!/js/lib/malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.css'
    ],

    function (can, _, TalesModel, appState) {

        return can.Control.extend({
            defaults: {
                viewpath: 'app/modules/rating/views/'
            }
        }, {
            init: function () {
                var self = this,
                    options = self.options;

                TalesModel.findAll({type: 1, active: 1}, function (tales) {

                    _.each(tales, function (tale){
                        tale.attr('likes', tale.attr('fbLikes') + tale.attr('vkLikes') + tale.attr('okLikes'));
                    });

                    self.element.html(can.view(options.viewpath + 'index.stache', {
                            tales: new can.List(tales),
                            appState: appState
                        })
                    );

                    self.element.find('.ratingTalesWrap').mCustomScrollbar({
                        scrollInertia: 0,
                        scrollButtons: {
                            enable: true,
                            scrollAmount: 200,
                            scrollType: 'stepless'
                        }
                    });

                    if (options.isReady) {
                        options.isReady.resolve();
                    }
                });
            }
        });

    }
);
