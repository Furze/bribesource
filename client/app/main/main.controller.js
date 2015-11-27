'use strict';

angular.module('storyApp')
  .controller('MainCtrl', function ($scope, $http, $location, socket,Auth) {

    $scope.games = [];

    $scope.showHowTo=false;

    $scope.toggleHowTo=function(){
      $scope.showHowTo= !$scope.showHowTo;
    }
    
    $scope.getGames = function() {
      $http.get('/api/games').success(function(games) {
        $scope.games = games;
        socket.syncUpdates('game', $scope.games);
      });
    }

    $scope.checkLoggedIn = function() {
      Auth.isLoggedInAsync(function(val) {

        $scope.isLoggedIn = val;
        if($scope.isLoggedIn) {
          var cu = Auth.getCurrentUser();
          $scope.currentUserImageUrl = cu.google.image.url;
          $scope.currentUserEmail = Auth.getCurrentUser().email;   
          console.log($scope.currentUserEmail);
        }
      });
    }
    $scope.checkLoggedIn();
    

    $scope.addGame = function() {

      if($scope.newGame === '') {
        return;
      }
      $http.post('/api/games', { name: $scope.newGame, gameCreator: $scope.currentUserEmail, gameCreatorImageUrl: $scope.currentUserImageUrl }).then(function(obj){
        $location.path('game/' + obj.data._id)
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
