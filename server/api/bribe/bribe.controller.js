/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /bribes              ->  index
 * POST    /bribes              ->  create
 * GET     /bribes/:id          ->  show
 * PUT     /bribes/:id          ->  update
 * DELETE  /bribes/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var Bribe = require('./bribe.model');

// Get list of bribes
exports.index = function(req, res) {
  Bribe.find(function (err, bribes) {
    if(err) { return handleError(res, err); }
    return res.json(200, bribes);
  });
};

// Get a single bribe
exports.show = function(req, res) {
  Bribe.findById(req.params.id, function (err, bribe) {
    if(err) { return handleError(res, err); }
    if(!bribe) { return res.send(404); }
    return res.json(bribe);
  });
};

// Creates a new bribe in the DB.
exports.create = function(req, res) {
  Bribe.create(req.body, function(err, bribe) {
    if(err) { return handleError(res, err); }
    return res.json(201, bribe);
  });
};

// Updates an existing bribe in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Bribe.findById(req.params.id, function (err, bribe) {
    if (err) { return handleError(res, err); }
    if(!bribe) { return res.send(404); }
    var updated = _.merge(bribe, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, bribe);
    });
  });
};

// Deletes a bribe from the DB.
exports.destroy = function(req, res) {
  Bribe.findById(req.params.id, function (err, bribe) {
    if(err) { return handleError(res, err); }
    if(!bribe) { return res.send(404); }
    bribe.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}