define(
	['canjs'],

	function (can) {
		return can.Control.extend({
			defaults: {
				viewpath: null
			}
		}, {
			init: function () {
				this.element.append('<p>some text</p>');
			},

			'p click': function (el) {
				el.css('color', '#f14c38')
			}

		});
	}
)