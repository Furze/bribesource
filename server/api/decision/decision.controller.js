'use strict';

var _ = require('lodash');

exports.runDecisionSimulation = function(req, res) {
  startDecisionSimulation(req.body.items, function(result) {
    return res.json(result);  
  });
};

function startDecisionSimulation(items, callback) {
  var result = {};
  simulate(items, [], function(resultList) {
    result.results = resultList;
    return callback(result);
  });
};

function simulate(items, resultList, callback) {
  if (items.length == 1) {
    resultList.push({
      'name': items[0].name,
      'position': resultList.length + 1
    });
    return callback(resultList);
  }

  var totalWeight = calculateTotalWeight(items);
  var portions = {};

  for (var i = 0; i < items.length; i++) {
    if (i === 0) {
      portions[items[i].name] = items[i].weight
    } else {
      portions[items[i].name] = items[i].weight + portions[items[i - 1].name];
    }
  }

  var randomNumber = getRandomNumber(1, totalWeight);
  var result = {};
  result.random = randomNumber + ' from range:  1-' + totalWeight;
  result.portions = portions;
  result.winner = determineWinner(portions, randomNumber);

  resultList.push({
    'name': result.winner,
    'position': resultList.length + 1
  });
  removeWinner(result.winner, items);
  setTimeout(function() {
    simulate(items, resultList, callback);
  }, 0);
}

function removeWinner(winner, items) {
  for (var i = 0; i < items.length; i++) {
    if (items[i].name === winner) {
      items.splice(i, 1);
    }
  };
}

function calculateTotalWeight(items) {
  var totalWeight = 0;
  for (var i = 0; i < items.length; i++) {
    totalWeight += items[i].weight;
  };
  return totalWeight;
}

function determineWinner(portions, random) {
  for (var i in portions) {
    if (random <= portions[i]) {
      return i;
    };
  }
}

function getRandomNumber(minRange, maxRange) {
  return _.random(minRange, maxRange);
}
