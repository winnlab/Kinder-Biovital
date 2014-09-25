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
                            baseUrl: window.location.origin,
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

                    _.each(tales, function (tale) {
                        var id = tale.attr('_id'),
                            cover = tale.attr('cover');
                        appState.attr('social').makeLike('rlike-' + id, {
                            'title': tale.attr('name'),
                            'desc': 'Мне понравилась сказка "' + tale.attr('name') + '"',
                            'url': window.location.origin + '/like/' + id,
                            'image': window.location.origin + (cover ? '/uploads/' + cover : '/img/favicon.png')
                        });
                    });


                    if (options.isReady) {
                        options.isReady.resolve();
                    }
                });
            }
        });

    }
);
