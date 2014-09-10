define(
    [
        'canjs',
        'underscore',
        'modules/tales/tale',
        'modules/tales/talesModel',
        'modules/tracks/tracksModel',
        'modules/covers/colorModel',
        'modules/covers/imagesModel',
        'modules/decorations/decorationsModel',
        'modules/heroes/heroesModel',
        'modules/replica/replicaModel'
    ],

    function (
        can,
        _,
        Tale,
        TalesModel,
        TracksModel,
        CoverColorModel,
        CoverImagesModel,
        DecorationsModel,
        HeroesModel,
        ReplicaModel
    ) {

        'use strict';

        return can.Control.extend({
            defaults: {
                viewpath: 'app/tale/views/',
                dataArr: {
                    tales: TalesModel,
                    tracks: TracksModel,
                    coverColors: CoverColorModel,
                    coverImages: CoverImagesModel,
                    decorations: DecorationsModel,
                    heroes: HeroesModel,
                    replica: ReplicaModel
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
                    if (key == 'decorations') {
                        self.module.attr(key, new options.dataArr[key].List({
                            queryOptions: {
                                sort: 'position'
                            }
                        }));
                    } else {
                        self.module.attr(key, new options.dataArr[key].List({}));
                    }
                }

                for (key in options.dataArr) {
                    def.push(self.module.attr(key));
                }

                can.when.apply(can, def).then(function () {
                    self.initSetControl(self.element.find('.taleForm'), new TalesModel(self.getStoredTale()));
                });

                self.element.html(can.view(options.viewpath + 'set.stache', self.module));

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
