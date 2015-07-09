'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var OutcomeSchema = new Schema({
  name: String,
  info: String,
  active: Boolean,
  game: String
});

module.exports = mongoose.model('Outcome', OutcomeSchema);