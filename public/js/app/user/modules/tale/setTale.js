define(
    [
        'canjs',
        'underscore',
        'modules/tales/tale'
    ],

    function (
        can,
        _,
        Tale
    ) {

        'use strict';

        return Tale.extend({
            defaults: {
                viewpath: '/js/app/admin/modules/tales/views/'
                , display: 'share'
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
            }

        });

    }
);
