'use strict';

angular.module('storyApp')
  .controller('PlayCtrl', function ($scope, User, Auth, $stateParams , $http , socket) {
    $scope.errors = {};

    $scope.gameid = $stateParams.id

    $http.get('/api/games/'+$scope.gameid).success(function(c) {
        $scope.game = c;
      });
   

    $scope.outcomes = [];
    
    $http.get('/api/outcomes?game='+$scope.gameid).success(function(outcomes) {
      $scope.outcomes = outcomes;
      socket.syncUpdates('outcome', $scope.outcomes);
    });

    // $http.get('/api/bribes?game='+$scope.gameid).success(function(bribes) {
    //   $scope.bribes = bribes;
    //   socket.syncUpdates('bribe', $scope.bribes);
    // });

    $scope.play = function() {

      var params = {};
      var items = []
      for(var i=0;i<$scope.outcomes.length;i++){
        var outcome = $scope.outcomes[i];
        var bribevalue=1;
        for(var j=0;j<$scope.bribes.length;j++){
          var bribe = $scope.bribes[j];
          if(outcome.bribe== bribe._id){
            bribevalue = bribe.value;
          }
        }
        var item = { name: outcome.name , weight: Number(bribevalue)};

        items.push(item);

      }
      params.items = items;

      $http.post('/api/decision/runDecisionSimulation',params).success(function(result){
          $scope.winner = result.results[0].name;
          $scope.showWinner = true;
      })
    }


    
  });
