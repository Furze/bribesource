'use strict';

var express = require('express');
var controller = require('./decision.controller');

var router = express.Router();
router.post('/runDecisionSimulation', controller.runDecisionSimulation);
module.exports = router;