define([
	'underscore',
	'backbone'
], function(_, Backbone) {
	'use strict';

	var ResponseModel = Backbone.Model.extend({
		// Default attributes for the question
		defaults: {
			answer: '',
			questionid: ''
		},
		
		url: 'someurl'
	});

	return ResponseModel;
});
