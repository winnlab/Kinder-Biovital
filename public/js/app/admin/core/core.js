require(['/js/app/admin/req.config.js'], function () {
	require([
			'app/router/router',
			'components/notification/notification',
			'core/config',

			'adminLTE',
			'core/appState',
			'components/tabs/tabs',
			'components/upload/upload',
			'core/viewHelpers',

			'css!cssDir/base'
		],
		function (Router, initNotification, config) {

			new Router(document.body, config.router);
			initNotification();

		}
	);
});
