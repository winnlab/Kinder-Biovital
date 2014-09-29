require.config({
	baseUrl: '/js/lib',
	urlArgs: "v=0.0.1.6",
	paths: {
		cssDir: '../../css/user',
		app: '../app/user',
		lib: '../app/admin/lib',
		src: '../app/user/src',
		can: 'canjs/amd/can/',
		canjs: 'canjs/amd/can',
		core: '../app/user/core',
		jquery: 'jquery/dist/jquery',
		underscore: 'underscore/underscore',
		modules: '../app/admin/modules',
		components: '../app/admin/components',
		viewHelpers: '../app/admin/core/viewHelpers',
		cssComponents: '../../css/admin/components',

		// Social
		fb: '../app/user/src/networks/fb-sdk',
		vk: '../app/user/src/networks/vk-sdk',
		ok: '../app/user/src/networks/ok-sdk'
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
		},
		'fb': {
			exports: 'FB'
		},
		'vk': {
			exports: 'VK'
		},
		'ok': {
			exports: 'OK'
		}

	},
	waitSeconds: 15
});
