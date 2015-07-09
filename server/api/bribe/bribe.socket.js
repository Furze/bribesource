/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var bribe = require('./bribe.model');

exports.register = function(socket) {
  bribe.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  bribe.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('bribe:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('bribe:remove', doc);
}