(function () {
	// taking from HTML5 Shiv v3.6.2 | @afarkas @jdalton @jon_neal @rem | MIT/GPL2 Licensed
	var supportsUnknownElements = false;

	(function () {
		try {
			var a = document.createElement('a');
			a.innerHTML = '<xyz></xyz>';

			supportsUnknownElements = a.childNodes.length == 1 || (function () {
				// assign a false positive if unable to shiv
				(document.createElement)('a');
				var frag = document.createDocumentFragment();
				return (
					typeof frag.cloneNode == 'undefined' ||
						typeof frag.createDocumentFragment == 'undefined' ||
						typeof frag.createElement == 'undefined'
					);
			}());
		} catch (e) {
			// assign a false positive if detection fails => unable to shiv
			supportsUnknownElements = true;
		}
	}());

	System.config({
		baseURL: '/js/app',
		main: 'user/core/',
		map: {
			"can/util/util.js": "can/util/jquery/jquery.js",
			"jquery/jquery": "jquery"
		},
		paths: {
			// Canjs
			// "can/*": "/js/lib/canjs/steal/canjs/*.js"
			"can/*": "/js/lib/canjsView/*.js",
			"can": "/js/lib/canjsView/can.js",
			// App
			"core/*": "/js/app/user/core/*.js",
			"modules/*": "/js/app/user/modules/*.js",
			"components/*": "/js/app/components/*.js",
			"lib/*": "/js/app/lib/*.js",
			"ui/*": "/js/app/ui/*.js",
			"utils/*": "/js/app/utils/*.js",
			// Vendors
			"jquery": "/js/lib/jquery/dist/jquery.js",
			"lodash": "/js/lib/lodash/dist/lodash.js"
		},
		meta: {
			jquery: {
				exports: "$",
				deps: supportsUnknownElements ? undefined : ["can/lib/html5shiv.js"]
			},
			can: {
				deps: [
					'jquery',
					'can/route/pushstate/',
					'can/map/define/',
					'can/map/delegate/',
					'can/map/sort/',
					'can/list/promise/',
					'can/construct/super/'
				]
			}
		},
		ext: {
			js: 'js',
			css: 'css',
			mustache: "can/view/mustache/system",
			stache: "can/view/stache/system"
		},
		bundle: [
            "components/home/home",
            "components/bootstrap/bootstrap",
            "components/login/login",
            "components/jquery-ui/jquery-ui"
        ]
	});
})();


System.buildConfig = {
    map: {
        "can/util/util": "can/util/domless/domless"
    }
};
