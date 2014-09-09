define(
	[
		'canjs',
		'underscore',
		'lib/list/list',
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
		List,
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

		return List.extend({
			defaults: {
				viewpath: 'app/modules/tales/views/',

				Edit: Tale,

				moduleName: 'tales',
				Model: TalesModel,

				deleteMsg: 'Вы действительно хотите удалить эту сказку?',
				deletedMsg: 'Сказка успешно удалена!',


				add: '.addTale',
				edit: '.editTale',
				remove: '.removeTale',

				formWrap: '.taleForm',

				parentData: '.tale',

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

				self.module = new can.Map({
					display: 'list'
				});

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

				self.module.delegate('display', 'set', function (ev, newVal) {
					if (newVal === 'list') {
						$('.left-side').removeClass('collapse-left');
						$('.right-side').removeClass('strech');
					} else if (newVal === 'set') {
						$('.left-side').addClass('collapse-left');
						$('.right-side').addClass('strech');
					}
				});

				if (route.entity_id && route.action) {
					self.module.attr('display', 'set');

					for (key in options.dataArr) {
						def.push(self.module.attr(key));
					}

					can.when.apply(can, def).then(function () {
						self.setDocCallback(route.entity_id);
					});
				}

				self.element.html(can.view(options.viewpath + options.viewName, self.module));

			},

			initSetControl: function (area, doc, entity) {
				var self = this,
					options = this.options,
					module = self.module,
					obj = {
						tale: doc,
						entity: entity
					};

				for (var key in options.dataArr) {
					obj[key] = module.attr(key)
				}

				new self.options.Edit(area, obj);
			}
		});

	}
);
