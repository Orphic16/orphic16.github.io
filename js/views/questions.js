define([
	'jquery',
	'underscore',
	'backbone',
	'text!templates/questionsTemplate.html',
	'text!templates/responsesTemplate.html',
	'collections/responsesCollection',
	'models/responseModel',
	'libs/highcharts'
], function($, _, Backbone, questionsTemplate, responsesTemplate, ResponsesCollection, ResponseModel, highcharts) {
	'use strict';

	var QuestionsView = Backbone.View.extend({
		template: _.template(questionsTemplate),
		responsesTemplate: _.template(responsesTemplate),

		// The DOM events specific to an item.
		events: {
			'click .submit': 'submitClick',
			'click .bar-link': 'barLinkClick',
			'click .donut-link': 'donutLinkClick',
			'click .pie-link': 'pieLinkClick'
		},

		initialize: function() {
			this.setupMockData();
			
			var that = this;
			Backbone.history.on('route', function () {
				that.render();
			});
			
			this.render();
		},
		
		render: function() {			
			if (window.navigation.action === 'results')
			{
				ResponsesCollection.fetch();
				var chartType = window.navigation.queryParams["chart"];
				if (chartType)
				{
					this.showResults(chartType);
				}
				else
				{				
					this.showResults("bar");
				}
			}
			else
			{
				this.$el.html(this.template(this.model.toJSON()));
		
				// Select first option to be checked
				this.$('.answers').find('input:radio:not(:disabled):first').attr('checked',true);
			}

			return this;
		},
		
		submitClick: function() {			
			var radio = this.$('.answers').find('input:radio').filter(":checked");
			var selectedValue = radio.val();
			
			ResponsesCollection.fetch();
			
			// Add new answer.
			var answer = new ResponseModel({answer: selectedValue, questionid: this.model.get("id") });			
			ResponsesCollection.add(answer);
			answer.save();
			
			Backbone.history.navigate('results/' + this.model.get("id") + "?chart=bar", {trigger: true});			
			this.showResults("bar");
		},
		
		barLinkClick: function() {
			Backbone.history.navigate('results/' + this.model.get("id") + "?chart=bar", {trigger: true});
			this.showResults("bar");
		},
		
		donutLinkClick: function() {
			Backbone.history.navigate('results/' + this.model.get("id") + "?chart=donut", {trigger: true});
			this.showResults("donut");
		},
		
		pieLinkClick: function() {
			Backbone.history.navigate('results/' + this.model.get("id") + "?chart=pie", {trigger: true});
			this.showResults("pie");
		},
		
		showResults: function(chartType) {			
			this.$el.html(this.responsesTemplate());
			
			// Set sellected tab based on chartType.
			this.$("." + chartType + "-link").parent().addClass("active");
			
			// This processing should not be done in JavaScript.
			// Future improvement fetch would return only responses for single question and their associated counts.
			
			// Filter by questionid
			var id = this.model.get("id");
			var filtered = ResponsesCollection.filter({questionid: id});
			
			var reduced = _.countBy(filtered, (function(obj){
				var object = obj.toJSON();
				return object.answer;
			}));
			
			var data = _.map(reduced, function(num, key) {
					return { name: key, y: num};
			});
			
			var count = filtered.length;
			var chartTitle = this.model.get("title");
			
			switch(chartType) {
				case "bar":
					this.drawBarChart(data, chartTitle, count);
					break;
				case "donut":
					this.drawDonutChart(data, chartTitle, count);
					break;
				case "pie":
					this.drawPieChart(data, chartTitle, count);
					break;
			}
		},
		
		drawBarChart: function(data, chartTitle, count) {
			$('#chart-container').highcharts({
				chart: {
					type: 'column'
				},
				title: {
					text: chartTitle
				},
				xAxis: {
					type: 'category'
				},
				yAxis: {
					title: {
						text: 'Response count'
					}

				},
				legend: {
					enabled: false
				},
				plotOptions: {
					series: {
						borderWidth: 0,
						dataLabels: {
							enabled: true,
							format: '{y}'
						}
					}
				},

				tooltip: {
					headerFormat: '',
					pointFormat: '<span style="color:{point.color}">{point.name}</span>: {point.y} of ' + count + ' responses<br/>'
				},

				series: [{
					name: '',
					colorByPoint: true,
					data: data
				}]					
			});
		},
		
		drawDonutChart: function(data, chartTitle, count) {
			$('#chart-container').highcharts({
				 chart: {
					type: 'pie'
				},
				title: {
					text: chartTitle
				},
				legend: {
					enabled: false
				},
				plotOptions: {
					pie: {
						innerSize: 100,
						allowPointSelect: true,
						cursor: 'pointer',
						dataLabels: {
							enabled: true,
							format: '<b>{point.name}</b>: {point.percentage:.1f} %',
							style: {
								color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
							}
						}
					}
				},

				tooltip: {
					headerFormat: '',
					pointFormat: '<span style="color:{point.color}">{point.name}</span>: {point.y} of ' + count + ' responses<br/>'
				},

				series: [{
					name: '',
					colorByPoint: true,
					data: data
				}]					
			});
		},
		
		drawPieChart: function(data, chartTitle, count) {
			$('#chart-container').highcharts({
				chart: {
					type: 'pie'
				},
				title: {
					text: chartTitle
				},
				legend: {
					enabled: false
				},
				plotOptions: {
					pie: {
						allowPointSelect: true,
						cursor: 'pointer',
						dataLabels: {
							enabled: true,
							format: '<b>{point.name}</b>: {point.percentage:.1f} %',
							style: {
								color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
							}
						}
					}
				},

				tooltip: {
					headerFormat: '',
					pointFormat: '<span style="color:{point.color}">{point.name}</span>: {point.y} of ' + count + ' responses<br/>'
				},

				series: [{
					name: '',
					colorByPoint: true,
					data: data
				}]					
			});
		},
		
		cleanup: function() {
			this.undelegateEvents();
			$(this.el).empty();
		},		
				
		// For now pushing some responses into local storage.  
		setupMockData: function() {
			var responses = [new ResponseModel({questionid: "5d877805df514f90887d0754a38e3f80", id:"3f605c5f71354d668b039700e775205a", answer: "Sir Lancelot of Camelot"}),
									new ResponseModel({questionid: "5d877805df514f90887d0754a38e3f80", id:"d7a642112f104dad85f30ee23b233ad9", answer: "Sir Galahad"}),
									new ResponseModel({questionid: "5d877805df514f90887d0754a38e3f80", id:"e75bcc3ce0b94748bdd3eb0c6a51ff7d", answer: "Sir Galahad"}),
									new ResponseModel({questionid: "5d877805df514f90887d0754a38e3f80",  id:"7b13a7e003d6431797cd4a1c55767c2e", answer: "King Arthur of the Britons"}),
									new ResponseModel({questionid: "5d877805df514f90887d0754a38e3f80",  id:"6b55125496b34558a7b5093b5f4eade6", answer: "King Arthur of the Britons"}),
									new ResponseModel({questionid: "016547e279df4d2c9157a5e5990805b8", id:"797b2aff2f8f45a3a37b3724b0175d52", answer: "To seek the Grail"}),
									new ResponseModel({questionid: "016547e279df4d2c9157a5e5990805b8", id:"5826060cb62546c1917f25af9d2cdbca", answer: "To seek the Grail"}),
									new ResponseModel({questionid: "016547e279df4d2c9157a5e5990805b8", id:"27acf88db96b4fac9a383fbb2bb35afe", answer: "To seek the Grail"}),
									new ResponseModel({questionid: "016547e279df4d2c9157a5e5990805b8", id:"651cff71ef9243168ab71708f8bcfd06", answer: "To seek the Grail"}),
									new ResponseModel({questionid: "016547e279df4d2c9157a5e5990805b8", id:"9cb84771ccb04fefba53b66d47bc1fea", answer: "To quote Monty Python"}),
									new ResponseModel({questionid: "016547e279df4d2c9157a5e5990805b8", id:"4b82f8b889b84ac78a16e17a8cfacdd8", answer: "To quote Monty Python"}),
									new ResponseModel({questionid: "016547e279df4d2c9157a5e5990805b8", id:"603d8d4be0cf4f769958ac77808a7ceb", answer: "What's a quest?"}),
									new ResponseModel({questionid: "016547e279df4d2c9157a5e5990805b8", id:"fa3a7b56daa8412292507ad37fb184a1", answer: "What's a quest?"}),
									new ResponseModel({questionid: "aa0a9c63b20147b3b068f5678edffa92", id:"a966244dd763445382fcc95235c68b17", answer: "Blue"}),
									new ResponseModel({questionid: "aa0a9c63b20147b3b068f5678edffa92", id:"a6a15525a95b42af92c3c17e590b20a7", answer: "Green"}),
									new ResponseModel({questionid: "aa0a9c63b20147b3b068f5678edffa92", id:"b7c138be5ca04862a2ebbd242b9f8879", answer: "Green"}),
									new ResponseModel({questionid: "aa0a9c63b20147b3b068f5678edffa92", id:"d8cbe88f3a2e4aff93c957edc9320021", answer: "Green"}),
									new ResponseModel({questionid: "aa0a9c63b20147b3b068f5678edffa92", id:"3884780f361a421e94957d135991ea5f", answer: "Green"}),
									new ResponseModel({questionid: "aa0a9c63b20147b3b068f5678edffa92", id:"c9940d78d6c54c908872a98c658c09f6", answer: "Green"}),
									new ResponseModel({questionid: "aa0a9c63b20147b3b068f5678edffa92", id:"f5f11e1a84964aa3b17e33c62e00054f", answer: "Red"}),
									new ResponseModel({questionid: "aa0a9c63b20147b3b068f5678edffa92", id:"4f4db9eda3d9452abee94e6b82d0e20c", answer: "Yellow"}),
									new ResponseModel({questionid: "aa0a9c63b20147b3b068f5678edffa92", id:"f7e87428dd1844fba842ba59fd9b703f", answer: "Yellow"}),
									new ResponseModel({questionid: "99f980c90c0c4755bda34bdbdd46b344", id:"ae6e9fa3ccf6489c80528057456f537b", answer: "African or a European swallow?"}),
									new ResponseModel({questionid: "99f980c90c0c4755bda34bdbdd46b344", id:"02591ab2b3e045f3ae5af22e4cb5bc99", answer: "42"}),
									new ResponseModel({questionid: "99f980c90c0c4755bda34bdbdd46b344", id:"ca6032c5eaa94244bfa6fb55bc1daaed", answer: "42"}),
									new ResponseModel({questionid: "99f980c90c0c4755bda34bdbdd46b344", id:"11b1c48ba2eb44058af14db6e6998a15", answer: "42"}),
									new ResponseModel({questionid: "99f980c90c0c4755bda34bdbdd46b344", id:"18cea083940c4729a51efe7c91c5ee14", answer: "I don't know"}),
									new ResponseModel({questionid: "99f980c90c0c4755bda34bdbdd46b344", id:"b9dc56af70bf40f1a06c52d41657b44a", answer: "I don't know"})];
									
			ResponsesCollection.add(responses);
			_.each(responses, function(response) { response.save() });
		}
	});

	return QuestionsView;
});
