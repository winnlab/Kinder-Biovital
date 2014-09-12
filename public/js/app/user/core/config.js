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
		}]
	},
	social: {
		fb: {
			appId: 512705898864753,
			permissions: ''
		},
		vk: {
			appId: 4547249,
			permissions: 4
		}
	}
});
