define(
    [
        'canjs',
        'underscore',
        'lib/viewport',
        'app/modules/tale/setTale',
        'modules/tales/talesModel',
        'modules/tracks/tracksModel',
        'modules/covers/colorModel',
        'modules/covers/imagesModel',
        'modules/decorations/decorationsModel',
        'modules/heroes/heroesModel'
    ],

    function (
        can,
        _,
        viewport,
        Tale,
        TalesModel,
        TracksModel,
        CoverColorModel,
        CoverImagesModel,
        DecorationsModel,
        HeroesModel
    ) {

        'use strict';

        return can.Control.extend({
            defaults: {
                viewpath: 'app/modules/tale/views/',
                dataArr: {
                    tracks: TracksModel,
                    coverColors: CoverColorModel,
                    coverImages: CoverImagesModel,
                    decorations: DecorationsModel,
                    heroes: HeroesModel
                }
            }
        }, {
            init: function () {

                var self = this,
                    options = self.options,
                    def = [],
                    route = can.route.attr();

                self.module = new can.Map({});

                for (var key in options.dataArr) {
                    self.module.attr(key, new options.dataArr[key].List({
                        queryOptions: {
                            sort: 'position'
                        }
                    }));
                }

                for (key in options.dataArr) {
                    def.push(self.module.attr(key));
                }

                self.element.html('<div class="taleForm"></div>')

                can.when.apply(can, def).then(function () {
                    self.initSetControl(self.element.find('.taleForm'), new TalesModel(self.getStoredTale()));
                });

            },

            getStoredTale: function () {
                var data = localStorage.getItem('tale');

                if (data) {
                    data = JSON.parse(data);
                }

                return data || {};
            },

            initSetControl: function (area, doc) {
                var self = this,
                    options = this.options,
                    module = self.module,
                    obj = {
                        tale: doc,
                        isReady: options.isReady,
                        interface: this.getInterfaceSize()
                    };

                for (var key in options.dataArr) {
                    obj[key] = module.attr(key)
                }

                new Tale(area, obj);
            },

            getInterfaceSize: function () {

                return viewport.getViewportWidth() > 1600 ? 'big' : 'small';

            }

        });

    }
);
