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
var Game = require('./game.model');

var InvitationService =  require('../../invitationService');

// Get list of games
exports.index = function(req, res) {
  Game.find(function (err, games) {
    if(err) { return handleError(res, err); }
    return res.json(200, games);
  });
};


// Get a single game
exports.show = function(req, res) {
  Game.findById(req.params.id, function (err, game) {
    if(err) { return handleError(res, err); }
    if(!game) { return res.send(404); }
    return res.json(game);
  });
};

// Creates a new game in the DB.
exports.create = function(req, res) {
  Game.create(req.body, function(err, game) {
    if(err) { return handleError(res, err); }
    return res.json(201, game);
  });
};

// Updates an existing game in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Game.findById(req.params.id, function (err, game) {
    if (err) { return handleError(res, err); }
    if(!game) { return res.send(404); }
		
		var updated = _.merge(game, req.body);
		
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, game);
    });
  });
};

// Updates an existing game in the DB.
exports.invite = function(req, res) {
  Game.findById(req.params.id, function (err, game) {
    if (err) { return handleError(res, err); }
    if(!game) { return res.send(404); }

    InvitationService.sendInvitations(game,function(game){      
      game.save(function (err) {
        if (err) { return handleError(res, err); }
        return res.json(200, game);
      });  
    });
  });
};

// Deletes a game from the DB.
exports.destroy = function(req, res) {
  Game.findById(req.params.id, function (err, game) {
    if(err) { return handleError(res, err); }
    if(!game) { return res.send(404); }
    game.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

exports.addInviteToGame = function(req,res) {
  Game.findById(req.params.id, function (err, game) {
    if (err) { return handleError(res, err); }
    if(!game) { return res.send(404); }
		
		if(!game.invitations) {
			game.invitations = [{ email: req.body.email }];
		} else {
			game.invitations.push({ email: req.body.email });
		}
		
		game.save(function(err) {
      if (err) { return handleError(res, err); }
      return res.json(200, game);
		})
  });
}

exports.addParticipantToGame = function(req,res) {
  Game.findById(req.params.id, function (err, game) {
    if (err) { return handleError(res, err); }
    if(!game) { return res.send(404); }
		
		if(!game.invitations) {
			game.participants = [{ email: req.body.email }];
		} else {
			game.participants.push({ email: req.body.email });
		}
		
		game.save(function(err) {
      if (err) { return handleError(res, err); }
      return res.json(200, game);
		})
  });
}

exports.deleteInvitation = function(req,res) {
  Game.findById(req.params.id, function (err, game) {
    if (err) { return handleError(res, err); }
    if(!game) { return res.send(404); }
		
		var index = -1;
		for(var i = 0; i < game.invitations.length; i++) {
			var gameInviteId = game.invitations[i].id;
			if(req.params.inviteId === gameInviteId) {
				index = i;
				break;
			}
		}
		
		if(index > -1) {
			game.invitations.splice(index, 1);
		}
		game.save(function(err) {
      if (err) { return handleError(res, err); }
      return res.json(200, game);
		})
  });
}

exports.deleteParticipant = function(req,res) {
  Game.findById(req.params.id, function (err, game) {
    if (err) { return handleError(res, err); }
    if(!game) { return res.send(404); }
		
		var index = -1;
		for(var i = 0; i < game.participants.length; i++) {
			var gameParticipantId = game.participants[i].id;
			if(req.params.participantId === gameParticipantId) {
				index = i;
				break;
			}
		}
		
		if(index > -1) {
			game.participants.splice(index, 1);
		}
		game.save(function(err) {
      if (err) { return handleError(res, err); }
      return res.json(200, game);
		})
  });
}

function handleError(res, err) {
  return res.send(500, err);
}