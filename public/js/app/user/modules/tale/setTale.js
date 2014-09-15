define(
    [
        'canjs',
        'underscore',
        'modules/tales/tale',
        'app/modules/tale/cover',
        'core/appState'
    ],

    function (
        can,
        _,
        Tale,
        Cover,
        appState
    ) {

        'use strict';

        return Tale.extend({
            defaults: {
                viewpath: '/js/app/admin/modules/tales/views/'
                // , display: 'cover'
            }
        }, {

            saveTale: function (cb, clearStorage) {
                var module = this.module;
                module.attr('tale').save()
                    .done(function (tale) {
                        if (!module.attr('clearStorage')) {
                            localStorage.setItem('tale', JSON.stringify(tale.attr()));
                        } else {
                            localStorage.removeItem('tale');
                        }

                        if (typeof cb === 'function') {
                            cb();
                        }
                    });
            },

            '.end click': function () {
                this.module.attr('clearStorage', true);
                this.saveTale(null);
            },

            '.closeFrame click': function (el) {
                if (el.hasClass('closePreview')) {
                    this.module.attr('talePreview', false);
                } else {
                    this.saveTale();
                    can.route.attr({module: 'main'}, true);
                }
            },

            '.shareTaleSoc click': function () {
                this.module.attr('shared', true);
            },

            // '.preview click': function () {
            //     var module = this.module,
            //         tale = module.attr('tale'),
            //         coverImage = _.find(module.attr('coverImages'), function (cover) {
            //             return cover.attr('_id') === tale.attr('coverImgId');
            //         }),
            //         coverColor = _.find(module.attr('coverColors'), function (cover) {
            //             return cover.attr('_id') === tale.attr('coverColorId');
            //         });
            //
            //     Cover.getCover(
            //         coverImage && coverImage.attr('img'),
            //         coverColor && coverColor.attr('color'),
            //         can.proxy(this.imageGeted, this)
            //     );
            // },

            imageGeted: function (imageCode) {
                // console.log(imageCode);

                appState.attr('social').share(imageCode, function () {
                    console.log('social post cb', arguments);
                });
            }

        });

    }
);
