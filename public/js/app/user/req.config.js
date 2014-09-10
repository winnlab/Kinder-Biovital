require.config({
	baseUrl: '/js/lib',
	paths: {
		cssDir: '../../css/user',
		app: '../app/user',
		lib: '../app/admin/lib',
		can: 'canjs/amd/can/',
		canjs: 'canjs/amd/can',
		core: '../app/user/core',
		jquery: 'jquery/dist/jquery',
		underscore: 'underscore/underscore',
		modules: '../app/admin/modules',
		components: '../app/admin/components',		
		viewHelpers: '../app/admin/core/viewHelpers',
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
			deps: [
				'jquery',
				'can/route/pushstate',
				'can/map/define',
				'can/map/delegate',
				'can/map/sort',
				'can/list/promise',
				'can/construct/super'
			]
		}
	},
	waitSeconds: 15
});
