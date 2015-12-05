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
var async = require('async');

exports.index = function(req, res, next) {

  /**
   * Select games that meet following conditions:
   * A. haven't got a winner,
   * B. haven't been scheduled to run,
   * C. game play date exists (can be future or past)
  */
  Game.find({gamePlayDate: {$exists: true, $ne: null}, winner: {$exists: false}, scheduledToRun: false}).exec(function(err, games) {
    if(err) return handleError(res, err);

    async.each(games, function(game, callback) {
      //set cron job flag to true for this game
      game.scheduledToRun = true;
      game.save(function(err) {
        if (err) return callback(err);

        var gameDate = new Date(game.gamePlayDate);
        scheduler.scheduleJob(gameDate,function(game) {
          //Get bribes for this game
          request.get({url: req.protocol + '://' + req.get('host') +'/api/bribes?game=' + game._id}, function(err, response, body) {
            if (err || response.statusCode != 200) return callback(err ? err : null);

            var bribes = JSON.parse(response.body);

            //Get outcomes for this game
            request.get({url: req.protocol + '://' + req.get('host') +'/api/outcomes?game=' + game._id}, function(err, response, body) {
              if (err || response.statusCode != 200) return callback(err ? err : null);

              var outcomes = JSON.parse(response.body);
              var items = [];
              var params = {};

              _.map(outcomes, function(outcome) {
                var bribevalue = 1;
                _.map(bribes, function(bribe) {
                  if (outcome.bribe == bribe._id && bribe.value) {
                     bribevalue = bribe.value;
                  }
                });
                var item = {
                  name: outcome.name,
                  weight: Number(bribevalue)
                };
                items.push(item);
              });
             
              params.items = items;

              //Run simulator for this game
              request({
                uri: req.protocol + '://' + req.get('host') +'/api/decision/runDecisionSimulation',
                method: 'POST',
                json: params
              }, function(err, response, body) {
                if (err || response.statusCode != 200) return callback(err ? err : null);

                game.winner = response.body.results[0].name;

                //Update game result
                request({
                  uri: req.protocol + '://' + req.get('host') +'/api/games/' + game._id,
                  method: 'PUT',
                  json: game
                }, function(err, response, body) {
                  if (err || response.statusCode != 200) return callback(err ? err : null);

                  //finish execution for this game
                  return callback();
                });
              });
            });
          });
        }.bind(null,game));
      });
      
    }, function(err) {
      if(err) return handleError(res, err);
      return res.send(200);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
