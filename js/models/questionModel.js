define([
	'underscore',
	'backbone'
], function(_, Backbone) {
	'use strict';

	var QuestionModel = Backbone.Model.extend({
		// Default attributes for the question
		defaults: {
			title: '',
			selectableAnswers: []
		},
		
		url: 'someurl'
	});

	return QuestionModel;
});
