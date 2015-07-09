/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var thing = require('./game.model');

exports.register = function(socket) {
  game.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  game.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('game:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('game:remove', doc);
}