'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var BribeSchema = new Schema({
  name: String,
  game: String,
  info: String,
  active: Boolean,
  value: Number
});

module.exports = mongoose.model('Bribe', BribeSchema);