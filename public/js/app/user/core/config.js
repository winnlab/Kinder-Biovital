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
			path: 'app/main/main',
			title: ''
		}, {
			name: 'create-tale',
			path: 'app/tale/tale',
			title: ''
		}, {
			name: 'fairy-tail',
			path: 'app/tale/view',
			title: ''
		}]
	}
});
