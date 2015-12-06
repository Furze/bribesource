'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var GameSchema = new Schema({
  name: String,
  info: String,
  active: Boolean,
  scheduledToRun: { type: Boolean, default: false},
  winner: String,
  gameCreator: String,
  gameCreatorImageUrl: String,
  gamePlayDate: Date,
  invitations: [{
  	email: String,
  	sent: Boolean
  }],
	participants: [{
		email: String
	}]
});

module.exports = mongoose.model('Game', GameSchema);