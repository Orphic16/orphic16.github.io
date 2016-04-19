'use strict';

// Require.js allows us to configure shortcut alias
require.config({
	// The shim config allows us to configure dependencies for
	// scripts that do not call define() to register a module
	shim: {
		underscore: {
			exports: '_'
		},
		backbone: {
			deps: [
				'underscore',
				'jquery'
			],
			exports: 'Backbone'
		},
		backboneLocalstorage: {
			deps: ['backbone'],
			exports: 'Store'
		}
	},
	paths: {
		jquery: 'libs/jquery-2.2.1',
		underscore: 'libs/underscore',
		backbone: 'libs/backbone',
		backboneLocalstorage: 'libs/backbone.localStorage',
		text: 'libs/text'
	}
});

require([
	'backbone',
	'views/app',
	'routers/router'
], function(Backbone, AppView, Router) {
	// Initialize routing and start Backbone.history()
	new Router();
	Backbone.history.start();

	// Initialize the application view
	new AppView();
});
