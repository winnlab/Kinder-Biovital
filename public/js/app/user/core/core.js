import can from 'can';
import Router from 'lib/router/';
import config from './config';
import appState from './appState';
// import Social from 'src/social';
// import ViewHelpers from 'viewHelpers';

var routerConfig = config.router;
routerConfig.lang = appState.attr('lang');

appState.attr('router', new Router(document.body, routerConfig));
// appState.attr('social', new Social());
