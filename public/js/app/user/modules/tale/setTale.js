define(
    [
        'canjs',
        'underscore',
        'modules/tales/tale',
        'core/appState',
        'lib/popUp/popUp'
    ],

    function (
        can,
        _,
        Tale,
        appState,
        popUp
    ) {

        'use strict';

        return Tale.extend({
            defaults: {
                viewpath: '/js/app/admin/modules/tales/views/'
                , display: 'share'
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

            '.end click': function () {
                var self = this,
                    module = self.module;

                module.saveTale(function () {
                    self.uploadCover(function () {
                        module.attr('display', 'share');
                    });
                }, true);
            },

            '.closeFrame click': function (el) {
                if (el.hasClass('closePreview')) {
                    this.module.attr('talePreview', false);
                } else {
                    this.module.saveTale();
                    can.route.attr({module: 'main'}, true);
                }
            }
        });
    }
);
