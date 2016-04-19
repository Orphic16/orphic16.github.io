define([
	'underscore',
	'backbone',
	'backboneLocalstorage',
	'models/questionModel'
], function(_, Backbone, Store, QuestionModel) {
	'use strict';

	var QuestionsCollection = Backbone.Collection.extend({
		// Reference to this collection's model.
		model: QuestionModel,

		// Save all of the questions items under this example's namespace.
		localStorage: new Store('questions-backbone')
	});

	return new QuestionsCollection();
});
