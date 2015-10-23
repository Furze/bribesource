'use strict';

var express = require('express');
var scheduler = require('node-schedule');
var controller = require('./scheduler.controller');

var router = express.Router();

router.get('/', controller.index);

module.exports = router;