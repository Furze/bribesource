'use strict';

var express = require('express');
var controller = require('./game.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.put('/:id/invite', controller.invite);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);
router.delete('/:id', controller.destroy);
router.delete('/:id', controller.destroy);

router.post('/:id/invite', controller.addInviteToGame);
router.post('/:id/participant', controller.addParticipantToGame);

router.delete('/:id/invite/:inviteId', controller.deleteInvitation);
router.delete('/:id/participant/:participantId', controller.deleteParticipant);

module.exports = router;