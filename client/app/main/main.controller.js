'use strict';

angular.module('storyApp')
  .controller('MainCtrl', function ($scope, $http, socket) {

    $scope.games = [];
    
    $scope.getGames = function() {
      $http.get('/api/games').success(function(games) {
        $scope.games = games;
        socket.syncUpdates('game', $scope.games);
      });
    }

    $scope.addGame = function() {
      if($scope.newGame === '') {
        return;
      }
      $http.post('/api/games', { name: $scope.newGame }).then(function(){
        $scope.getGames();
      })
      $scope.newGame = '';
    };

    $scope.deleteGame = function(game) {
      $http.delete('/api/games/' + game._id).then(function(){
          $scope.getGames();
      })
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('game');
    });


    $scope.awesomeThings = [];


    $http.get('/api/things').success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
      socket.syncUpdates('thing', $scope.awesomeThings);
    });

    $scope.addThing = function() {
      if($scope.newThing === '') {
        return;
      }
      $http.post('/api/things', { name: $scope.newThing });
      $scope.newThing = '';
    };

    $scope.deleteThing = function(thing) {
      $http.delete('/api/thing/' + thing._id);
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('thing');
    });

    $scope.getGames();
  });
