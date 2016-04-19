define([
	'jquery',
	'underscore',
	'backbone',
	'collections/questionsCollection',
	'models/questionModel',
	'views/questions'
], function($, _, Backbone, QuestionsCollection, QuestionModel, QuestionsView) {
	'use strict';

	// Our overall **AppView** is the top-level piece of UI.
	var AppView = Backbone.View.extend({
		// Instead of generating a new element, bind to the existing skeleton of
		// the App already present in the HTML.
		el: '.container',
		
		questionsView: null,

		// Delegated events for creating new items, and clearing completed ones.
		events: {
			'click .load-new-question': 'loadNewQuestionClick'
		},

		initialize: function() {
			this.setupMockData();
			
			this.$contentPlaceholder = this.$('#content-placeholder');
			
			this.render();
		},

		render: function() {			
			this.loadQuestion();
		},
		
		loadNewQuestionClick: function() {
			if (this.questionsView) {
					this.questionsView.cleanup();
			}
			Backbone.history.navigate('');
			window.navigation = {};
			this.loadQuestion();
		},
		
		loadResults: function(id) {
			Backbone.history.navigate('results/' + this.model.get("id"), {trigger: true});	
			window.navigation = {};
			this.loadQuestion();
		},
		
		// Add a single question item to the list by creating a view for it, and
		// appending its element to the `<div>`.
		loadQuestion: function() {
			QuestionsCollection.fetch();
			
			var question = null;
			
			if (window.navigation.id)
			{
				question = QuestionsCollection.get(window.navigation.id);
			}
			else
			{			
				// Pick a random question.
				// Future improvement would be to make the rest endpoint return a random question instead of retrieving all data and selecting a random question after.
				question = QuestionsCollection.models[Math.floor(Math.random() * QuestionsCollection.length)];
			}
			
			this.questionsView = new QuestionsView({ model: question, el: this.$contentPlaceholder });
		},
		
		// For now just pushing 4 questions into local storage.  
		setupMockData: function() {
			var questions = [new QuestionModel({title: "What is your name?", id: "5d877805df514f90887d0754a38e3f80", selectableAnswers: ["Sir Lancelot of Camelot", "Sir Galahad", "King Arthur of the Britons"]}),
									new QuestionModel({title: "What is your quest?", id: "016547e279df4d2c9157a5e5990805b8", selectableAnswers: ["To seek the Grail", "To quote Monty Python", "What's a quest?"]}),
									new QuestionModel({title: "What is your favorite color?", id: "aa0a9c63b20147b3b068f5678edffa92", selectableAnswers: ["Blue", "Green", "Red", "Yellow"]}),
									new QuestionModel({title: "What is the airspeed velocity of an unladen swallow?", id: "99f980c90c0c4755bda34bdbdd46b344", selectableAnswers: ["African or a European swallow?", "42", "I don't know"]})];
			
			QuestionsCollection.add(questions);
			_.each(questions, function(question) { question.save() });
		}
	});

	return AppView;
});
