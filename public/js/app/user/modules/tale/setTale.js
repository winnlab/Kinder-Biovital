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
            }
        }, {

            init: function () {

                var coverPopUpShowed = false;

                if (!localStorage.getItem('tale')) {
                    popUp.show({
                        msg: appState.attr('locale.goodTales'),
                        choice: false
                    });
                }

                this._super.apply(this, arguments);

                this.module.delegate("display", "set", function (ev, newVal, oldVal, prop) {
                    if (newVal === 'cover' && !coverPopUpShowed) {
                        popUp.show({
                            msg: appState.attr('locale.coverHeroes'),
                            choice: false
                        });
                        coverPopUpShowed = true;
                    }
                });
            },

            '.end click': function () {
                var self = this,
                    module = self.module;

                if (!module.attr('tale.name')) {
                    popUp.show({
                        msg: appState.locale.emptyName,
                        choice: false
                    });
                    return false;
                }

                module.saveTale(function () {
                    self.uploadCover(function () {
                        var id = module.attr('tale._id');
                        appState.attr('social').getProvider('ok').makeShare('ok-tale-share-' + id, {
                            'url': window.location.origin + '/like/' + id,
                            'settings': "{width:45,height:50,st:'rounded',sz:45,nt:1,nc:1}"
                        });
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
            },

            '.finish click': function () {
                var module = this.module;
                module.attr('clearStorage', true);
                module.saveToStorage();

                popUp.show({
                    msg: appState.attr('locale.created'),
                    choice: false,
                    cb: function () {
                        can.route.attr({
                            module: 'rating'
                        }, true);
                    }
                });

            }
        });
    }
);
