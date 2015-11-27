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

var Game = require('../game/game.model');

// Schedule all games
exports.index = function(req, res) {
  Game.find(function (err, games) {
  	for(var i=0;i<games.length;i++){
  		var game = games[i];  		
  		if(game.gamePlayDate!=undefined){
	  		var gameDate = new Date(game.gamePlayDate);
	  		console.log('Game Scheduled:'+gameDate);
	  		scheduler.scheduleJob(gameDate,function(game){	  			  			
	  			if(game.winner==undefined){
	  				console.log('Playing Game:'+game._id);
	  				console.log(game);		
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
