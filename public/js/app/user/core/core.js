require(['/js/app/user/req.config.js'], function () {

	require([
			'app/router/router',
			'core/config',
			'core/appState',
			'src/social',
			'viewHelpers',

			'css!cssDir/reset.css',
			'css!cssDir/base.css'
		],
		function (
			Router,
			config,
			appState,
			Social
		) {
			var body = $('body');

			appState.attr('router', new Router(body, config.router));
			appState.attr('social', new Social('fb'));
			//
			// appState.attr('social').logIn();

		}
	);
});
