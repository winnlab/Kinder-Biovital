require(['/js/app/user/req.config.js'], function () {

	require([
			'app/router/router',
			'core/config',
			'core/appState',
			'viewHelpers',

			'css!cssDir/reset.css',
			'css!cssDir/base.css'
		],
		function (
			Router,
			config,
			appState
		) {
			var body = $('body');

			appState.attr('router', new Router(body, config.router));

		}
	);
});
