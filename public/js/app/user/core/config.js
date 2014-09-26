define({
	router: {
		base: '/',
		modulesContainer: '#modules',
		routes: [{
			route: ':module',
			defaults: {
				module: 'main'
			}
		}],
		modules: [{
			name: 'main',
			path: 'modules/main/'
		}, {
			name: 'tales',
			path: 'modules/tales/'
		}, {
			name: 'create-tale',
			path: 'modules/tale/'
		}, {
			name: 'fairy-tale',
			path: 'modules/tale/view'
		}, {
			name: 'sp',
			path: 'modules/simplePage/'
		}, {
			name: 'rating',
			path: 'modules/rating/'
		}]
	},
	social: {
		fb: {
			appId: 512705898864753,
			permissions: 'publish_actions'
		},
		vk: {
			appId: 4547249,
			permissions: 4
		},
		ok: {
			appId: 1101943552,
			publicKey: 'CBAEFPKCEBABABABA'
		}
	}
});
