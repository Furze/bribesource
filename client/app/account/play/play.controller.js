'use strict';

angular.module('storyApp')
  .controller('PlayCtrl', function ($scope, User, Auth, $stateParams , $http , socket) {
    $scope.errors = {};

    $scope.gameid = $stateParams.id

    $http.get('/api/games/'+$scope.gameid).success(function(c) {
        $scope.game = c;
      });
   

    $scope.outcomes = [];
    
    $http.get('/api/outcomes').success(function(outcomes) {
      $scope.outcomes = outcomes;
      socket.syncUpdates('outcome', $scope.outcomes);
    });

    $http.get('/api/bribes').success(function(outcomes) {
      $scope.bribes = bribes;
      socket.syncUpdates('bribe', $scope.bribes);
    });

    $scope.play = function() {

      var params = {};
      var items = []
      for(var i=0;i<outcomes.length;i++){

        var bribevalue=1;
        for(var j=0;j<bribes.length;j++){
          if(outcome.bribe== bribe._id){
            bribevalue = bribe.value;
          }
        }
        var item = { name: outcome.name , weight: Number(bribevalue)};

        items.push(item);

      }

      $http.post('/api/decision/runDecisionSimulation',params).success(function(result){
          $scope.winner = result.results[0].name;
      })
    }


    
  });
