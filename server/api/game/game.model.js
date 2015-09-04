'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var GameSchema = new Schema({
  name: String,
  info: String,
  active: Boolean,
  winner: String,
  gameCreator: String,
  gameCreatorImageUrl: String,
  invitations: [{
  	email: String
  }]
});

module.exports = mongoose.model('Game', GameSchema);