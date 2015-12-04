/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /games              ->  index
 * POST    /games              ->  create
 * GET     /games/:id          ->  show
 * PUT     /games/:id          ->  update
 * DELETE  /games/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');

var scheduler = require('node-schedule');
var request = require("request");
var moment = require("moment");
var Game = require('../game/game.model');
var config = require('../../config/environment/index');
// Schedule all games
exports.index = function(req, res) {
  Game.find(function (err, games) {
  	for(var i=0;i<games.length;i++){
  		var game = games[i];
  		
  		if(game.gamePlayDate!=undefined && moment().isAfter(moment(game.gamePlayDate))){
	  		var gameDate = new Date(game.gamePlayDate);
	  		// console.log('Game Scheduled:'+gameDate);
	  		scheduler.scheduleJob(gameDate,function(game){
	  			if(game.winner==undefined){
	  				// console.log('Playing Game:'+game._id);
	  				// console.log(game);
	  				request.get({url: req.protocol + '://' + req.get('host') +'/api/outcomes?game=' + game._id}, function(err, response, body) {
	  					if (err) {
	  						console.log("1", err);
	  					} else {
	  						var outcomes = response.body;
		  					var params = {};
						    var items = [];

						      for (var i = 0; i < outcomes.length; i++) {
						        var outcome = outcomes[i];
						        outcome.bribevalue = 1;
						        var item = {
						          name: outcome.name,
						          weight: Number(outcome.bribevalue)
						          // color: outcome.color,
						        };
						        items.push(item);
						      }
						      params.items = items;
						       // $http.post('/api/decision/runDecisionSimulation', params).success(function (result) {
						       //    $scope.winner = result.results[0].name;
						       //    $scope.game.winner = $scope.winner;
						       //    $http.put('/api/games/' + $scope.gameid, $scope.game).then(function () {
						       //      $scope.renderPie(items);
						       //    }, function (response) {
						       //      //TODO: display some kind of error that the game was not played and should try again.
						       //    });
						       //  });
							request.post({url: req.protocol + '://' + req.get('host') +'/api/decision/runDecisionSimulation', body: items}, function(err, response, body) {
								if (err) {
									console.log("2",err);
								} else {

									var winner = response.body.results[0].name;
									game.winner = winner;
									request.put({url: req.protocol + '://' + req.get('host') +'/api/games/' + game._id, body: game}, function(err, response, body) {
										if (err) console.log(err);
										console.log(game);
										//finish
									});
								}
							});
	  					}
	  				});
	  			}
	  		}.bind(null,game));
	  	}
  	}
    if(err) { return handleError(res, err); }
    return res.json(200, games);
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
