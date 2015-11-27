'use strict';

var _ = require('lodash');

exports.sendInvitations = function(game,done) {
	

	_.forEach(game.invitations,function(invitation){

		console.log(invitation.email);


	})

 
};
