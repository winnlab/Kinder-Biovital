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
			path: 'app/main/main'
		}, {
			name: 'tales',
			path: 'app/tales/tales'
		}, {
			name: 'create-tale',
			path: 'app/tale/tale'
		}, {
			name: 'fairy-tale',
			path: 'app/tale/view'
		}]
	}
});
