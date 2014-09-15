define([
	'canjs'
],
	function (can) {

		var AppState = can.Map.extend({
			define: {
				notification: {
					value: {},
					serialize: false
				}
			},
			langs: window.langs,
			locale: window.locale
		});

		return new AppState();
	}
);
