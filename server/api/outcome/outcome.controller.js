/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /outcomes              ->  index
 * POST    /outcomes              ->  create
 * GET     /outcomes/:id          ->  show
 * PUT     /outcomes/:id          ->  update
 * DELETE  /outcomes/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var Outcome = require('./outcome.model');

// Get list of outcomes
exports.index = function(req, res) {  
  var q = Outcome.find();
  if(req.query.game){
    q.where( {game: req.query.game} );
  }
  q.exec(function (err, outcomes) {
    if(err) { return handleError(res, err); }
    return res.json(200, outcomes);
  });
};

// Get a single outcome
exports.show = function(req, res) {
  Outcome.findById(req.params.id, function (err, outcome) {
    if(err) { return handleError(res, err); }
    if(!outcome) { return res.send(404); }
    return res.json(outcome);
  });
};

// Creates a new outcome in the DB.
exports.create = function(req, res) {
  Outcome.create(req.body, function(err, outcome) {
    if(err) { return handleError(res, err); }
    return res.json(201, outcome);
  });
};

// Updates an existing outcome in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Outcome.findById(req.params.id, function (err, outcome) {
    if (err) { return handleError(res, err); }
    if(!outcome) { return res.send(404); }
    var updated = _.merge(outcome, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, outcome);
    });
  });
};

// Deletes a outcome from the DB.
exports.destroy = function(req, res) {
  Outcome.findById(req.params.id, function (err, outcome) {
    if(err) { return handleError(res, err); }
    if(!outcome) { return res.send(404); }
    outcome.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}