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
				form: ''
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
					data = can.deparam(el.serialize()),
					doc = self.options.doc;

				doc.attr(data);

				doc.save()
    				.done(function(doс) {
						self.options.entity(doc.attr('_id'));
    					can.route.attr({'entity_id': doc.attr('_id')});
    					self.setNotification('success', self.successMsg);
    				})
    				.fail(function (doc) {						
    					self.setNotification('error', self.errorMsg);
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
