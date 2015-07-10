'use strict';

var _ = require('lodash');

exports.runDecisionSimulation = function(req, res) {
  var result = startDecisionSimulation(req.body.items);
  console.log('Result: ' + result);
  return res.json(result);
};

function startDecisionSimulation(items) {
  var result = {};
  result.results = simulate(items, []);
  return result;
};

function simulate(items, resultList) {
  if (items.length == 1) {
    resultList.push({'name': items[0].name, 'position': resultList.length+1});
    return resultList;
  }

  var totalWeight = calculateTotalWeight(items);
  var portions = {};

  for (var i = 0; i < items.length; i++) {
    if (i === 0) {
      portions[items[i].name] = items[i].weight
    } else {
      portions[items[i].name] = items[i].weight + portions[items[i-1].name];
    }
  }

  var randomNumber =  _.random(1, totalWeight);
  var result = {};
  result.random = randomNumber;
  result.portions = portions;
  result.winner = determineWinner(portions,randomNumber);
  console.log('Iteration: ' + (resultList.length+1));
  console.log(result);

  resultList.push({'name':result.winner , 'position': resultList.length+1});
  removeWinner(result.winner,items);
  return simulate(items, resultList);
}

function removeWinner(winner, items){
for (var i = 0; i < items.length; i++) {
    if(items[i].name === winner){
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
  for(var i in portions){
    if (random <= portions[i]) {
      return i;
    };
  }
}

