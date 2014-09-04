require.config({
	baseUrl: '/js/lib',
	paths: {
		css: '../../css/admin',
		app: '../app/admin',
		lib: '../app/admin/lib',
		can: 'canjs/amd/can/',
		canjs: 'canjs/amd/can',
		core: '../app/admin/core',
		jquery: 'jquery/dist/jquery',
		modules: '../app/admin/modules',
		funcunit: 'funcunit/dist/funcunit',
		underscore: 'underscore/underscore',
		components: '../app/admin/components',
		adminLTE: 'admin-lte/js/AdminLTE/app',
		bootstrap: 'admin-lte/js/bootstrap.min',
		cssComponents: '../../css/admin/components'
	},
	map: {
		'*': {
			'css': 'require-css/css'
		}
	},
	shim: {
		'jquery': {
			exports: '$'
		},
		'underscore': {
			exports: '_'
		},
		'funcunit': {
			exports: 'F'
		},
		'canjs': {
			deps: ['jquery', 'can/route/pushstate', 'can/map/define', 'can/map/delegate', 'can/map/sort', 'can/list/promise']
		},
		'components/upload/upload': {
			deps: ['jquery-form/jquery.form']
		},
		'bootstrap': {
			deps: ['jquery']
		},
		'adminLTE': {
			deps: ['jquery', 'bootstrap']
		}
	}
});