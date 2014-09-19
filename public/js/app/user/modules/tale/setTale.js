define(
    [
        'canjs',
        'underscore',
        'modules/tales/tale',
        'app/modules/tale/cover',
        'core/appState',
        'lib/popUp/popUp'
    ],

    function (
        can,
        _,
        Tale,
        Cover,
        appState,
        popUp
    ) {

        'use strict';

        return Tale.extend({
            defaults: {
                viewpath: '/js/app/admin/modules/tales/views/'
                // , display: 'share'
            }
        }, {

            init: function () {

                if (!localStorage.getItem('tale')) {
                    popUp.show({
                        msg: appState.locale.goodTales,
                        choice: false
                    });
                }

                this._super.apply(this, arguments);
            },

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

            '.share click': function (el) {
                appState.attr('social').changeNw(el.data('nw'));
                var module = this.module,
                    tale = module.attr('tale'),
                    coverImage = _.find(module.attr('coverImages'), function (cover) {
                        return cover.attr('_id') === tale.attr('coverImgId');
                    }),
                    coverColor = _.find(module.attr('coverColors'), function (cover) {
                        return cover.attr('_id') === tale.attr('coverColorId');
                    });

                Cover.getCover(
                    coverImage && coverImage.attr('img'),
                    coverColor && coverColor.attr('color'),
                    can.proxy(this.shareCover, this)
                );
            },

            shareCover: function (image) {
                var self = this,
                    message = 'Some message';

                appState.attr('social').shareCanvas(image, message, function () {
                    console.log('social post cb', arguments);
                    self.module.attr('tale.shared', 1);
                    // self.module.attr('clearStorage', true);
                    self.saveTale(null);
                });
            }

        });

    }
);
