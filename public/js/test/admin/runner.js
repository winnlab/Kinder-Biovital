require(['/js/app/admin/req.config.js'], function () {
	require(
		['jquery'],
		function ($) {
			var specs = [];

			specs.push('lib/list/list-test');

			$(function() {
				require(specs, function () {
					mocha.run();
				});
			});
		}
	);
});