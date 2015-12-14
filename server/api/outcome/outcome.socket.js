/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var outcome = require('./outcome.model');

exports.register = function(socket) {
  outcome.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  outcome.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('outcome:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('outcome:remove', doc);
}