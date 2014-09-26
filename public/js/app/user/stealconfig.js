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
		baseURL: '/js/app/user',
		main: 'core/',
		map: {
			"can/util/util.js": "can/util/jquery/jquery.js",
			"jquery/jquery": "jquery"
		},
		paths: {
			"jquery": "/js/lib/jquery/dist/jquery.js",
			"can/*": "/js/lib/canjs/steal/canjs/*.js"
			// "can/*": "/js/lib/canjsView/*.js"
		},
		meta: {
			jquery: {
				exports: "$",
				deps: supportsUnknownElements ? undefined : ["can/lib/html5shiv.js"]
			},
			can: {
				deps: ['jquery']
			},
			"ui/core": {deps: ["jquery","theme/core.css!","theme/theme.css!"]},
			"ui/widget": {deps: ["jquery"]},
			"ui/accordion": {deps: ["ui/core","ui/widget","theme/accordion.css!"]}
		},
		ext: {
			js: 'js',
			css: 'css',
			mustache: "can/view/mustache/mustache.js",
			stache: "can/view/stache/stache.js"
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
