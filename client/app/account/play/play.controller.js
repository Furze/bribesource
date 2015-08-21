'use strict';

angular.module('storyApp')
  .controller('PlayCtrl', function ($scope, User, Auth, $stateParams , $http , socket, PieService) {
    $scope.errors = {};

    $scope.gameid = $stateParams.id

    $http.get('/api/games/'+$scope.gameid).success(function(c) {
        $scope.game = c;

          $http.get('/api/bribes?game='+$scope.gameid).success(function(bribes) {
            $scope.bribes = bribes;
            socket.syncUpdates('bribe', $scope.bribes);

            $scope.outcomes = [];

            $http.get('/api/outcomes?game='+$scope.gameid).success(function(outcomes) {
            $scope.outcomes = outcomes;

            var o = $scope.outcomes;
            for(var i=0;i<$scope.outcomes.length;i++){
              var outcome = $scope.outcomes[i];              
              outcome.bribevalue=1;
              var bribename ='Not assigned';
              for(var j=0;j<$scope.bribes.length;j++){
                var bribe = $scope.bribes[j];
                if(outcome.bribe==bribe._id){
                  if(bribe.value){
                    outcome.bribevalue = bribe.value;  
                  }else{
                    
                  }
                  outcome.bribename = bribe.name;                  
                }
              }
            }

            $scope.play();
          });
      });

      socket.syncUpdates('outcome', $scope.outcomes);
    });


    $scope.play = function() {

      var params = {};
      var items = []

      var labels = [];
      var  values = [];

      for(var i=0;i<$scope.outcomes.length;i++){
        var outcome = $scope.outcomes[i];
        var item = { name: outcome.name , weight: Number(outcome.bribevalue)};
        labels.push(item.name);
        values.push(item.weight);
        items.push(item);

      }
      params.items = items;

      PieService.renderPie(labels,values);

      $http.post('/api/decision/runDecisionSimulation',params).success(function(result){
          $scope.winner = result.results[0].name;
          $scope.showWinner = true;

          //need to save the game winner
    
      })
    }



    
  });
