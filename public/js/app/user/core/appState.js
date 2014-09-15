define([
	'canjs',
	'lib/viewport'
],
	function (can, viewport) {
		
		var AppState = can.Map.extend({
				//Settings
				imgPath: '/img/',
				uploadPath: '/uploads/',

				locale: window.data.locale,
				lang: window.data.lang,

				size: {
					width: 1224,
					height: 650,
					winHeight: function () {
						return viewport.getViewportHeight();
					},
					topOffset: function () {
						return ((viewport.getViewportHeight() - this.attr('height')) / 2 ) + 'px';
					},
					leftOffset: function () {
						return ((viewport.getViewportWidth() - this.attr('width')) / 2) + 'px';
					}
				}

			}),
			appState = new AppState();

		delete window.data;

		return appState;
	}
);
