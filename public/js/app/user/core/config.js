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
			path: 'app/modules/main/main'
		}, {
			name: 'tales',
			path: 'app/modules/tales/tales'
		}, {
			name: 'create-tale',
			path: 'app/modules/tale/tale'
		}, {
			name: 'fairy-tale',
			path: 'app/modules/tale/view'
		}, {
			name: 'sp',
			path: 'app/modules/simplePage/simplePage'
		}, {
			name: 'rating',
			path: 'app/modules/rating/rating'
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
