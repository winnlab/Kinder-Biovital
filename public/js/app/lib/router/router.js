'use strict';
import can from 'can/';
import routeStache from './views/route.stache!';
import Modules from './modules';
import hub from 'utils/hub';

export default can.Control.extend({
	defaults: {
		langBtn: '.isoLang',
		moduleBtn: '.module'
	}
}, {
	init: function (el, options) {
		this.Modules = new Modules({
			moduleTypes: this.options.modules
		});

		var html = can.view(routeStache, {
				modules: this.Modules.attr('modules')
			}),
			lang = options.lang,
			self = this;

		$(options.modulesContainer).prepend(html);

		_.each(options.routes, function (route) {
			can.route(route.route, route.defaults ? route.defaults : {});
		});

		can.on.call(hub, 'silentModule', can.proxy(this.Modules.silentInit, this.Modules));

		can.route.bindings.pushstate.root = (lang ? '/' + lang : '') + '/';
		can.route.ready();

	},

	'{moduleBtn} click': function (el, ev) {
		ev.preventDefault();

		var href = el.attr('href') ? el.attr('href') : el.attr('data-href');

		try {
			if (href) {

				var routeObj = can.route.deparam(href);

				if (!_.isEmpty(routeObj)) {
					can.route.attr(routeObj, true);
				} else {
					throw new  Error("There now such routing rule for '" + href + "', please check your configuration file");
				}

			} else {
				throw new  Error("href parameter is undefined");
			}
		} catch (e) {
			console.error(e);
		}
	},

	':module route': 'routeChanged',
	':module/:id route': 'routeChanged',

	routeChanged: function(data) {
		var moduleName = data.module,
			id = moduleName + (data.id ? '-' + data.id : '');
		this.Modules.initModule(moduleName, id);
	},

	'{langBtn} click': function (el, ev) {
		ev.preventDefault();

		var lang = el.attr('href').replace(/\//, ''),
			currentLink = '/' + can.route.param(can.route.attr());

		document.location.href = (lang ? '/' + lang : '') + currentLink;
	}

});
