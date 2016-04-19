define([
	'backbone'
], function(Backbone) {
	'use strict';

	var QuestionRouter = Backbone.Router.extend({
		routes: {
			'question/:id': 'question',	
			'results/:id?:queryString': 'results',
			'results/:id': 'results',	
			'*filter': 'setFilter'
		},

		setFilter: function(param) {
			window.navigation = {action: param} || '';
		},
		
		question: function(id) {
			window.navigation = {action: 'questions', id: id};
		},
		
		results: function(id, queryString) {
			var queryParams = this.parseQueryString(queryString);
			window.navigation = {action: 'results', id: id, queryParams: queryParams}
		},
		
		parseQueryString: function(queryString){
			var params = {};
			if(queryString){
				_.each(
					_.map(decodeURI(queryString).split(/&/g),function(el,i){
						var aux = el.split('='), o = {};
						if(aux.length >= 1){
							var val = undefined;
							if(aux.length == 2)
								val = aux[1];
							o[aux[0]] = val;
						}
						return o;
					}),
					function(o){
						_.extend(params,o);
					}
				);
			}
			return params;
		}
	});

	return QuestionRouter;
});
