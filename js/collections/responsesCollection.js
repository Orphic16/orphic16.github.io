define([
	'underscore',
	'backbone',
	'backboneLocalstorage',
	'models/responseModel'
], function(_, Backbone, Store, ResponseModel) {
	'use strict';

	var ResponsesCollection = Backbone.Collection.extend({
		// Reference to this collection's model.
		model: ResponseModel,

		// Save all of the answers items under this example's namespace.
		localStorage: new Store('responses-backbone')
	});

	return new ResponsesCollection();
});
