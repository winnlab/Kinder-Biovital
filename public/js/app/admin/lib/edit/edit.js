define(
	[
		'canjs',
		'core/appState'
	],

	function (can, appState) {

		return can.Control.extend({
			defaults: {
				viewpath: '',
                viewName: 'set.stache',
				moduleName: 'doc',
				successMsg: 'Сущность успешно сохранена.',
				errorMsg: 'Ошибка сохранения сущности.',
                // Selectors
				form: '',
				// is change entityId param in can.route
				setRoute: true
			}
		}, {
			init: function () {
				var options = this.options,
					data = {};
				data[options.moduleName] = options.doc;
				this.element.html(can.view(options.viewpath + options.viewName, data));
			},

			'{form} submit': function (el, ev) {
				ev.preventDefault();

				var self = this,
					options = self.options,
					data = can.deparam(el.serialize()),
					doc = options.doc;

				doc.attr(data);

				doc.save()
    				.done(function(doс) {
						options.entity(doc.attr('_id'));
						if (options.setRoute) {
    						can.route.attr({'entity_id': doc.attr('_id')});
						}
    					self.setNotification('success', options.successMsg);
    				})
    				.fail(function (doc) {
    					self.setNotification('error', options.errorMsg);
    				});

			},

			setNotification: function (status, msg) {
				appState.attr('notification', {
					status: status,
					msg: msg
				});
			}
		});

	}
);
