'use strict';

angular.module('storyApp')
  .controller('GameCtrl', function ($scope, User, Auth, $stateParams , $http , socket) {
    $scope.errors = {};

    $scope.gameid = $stateParams.id

    $http.get('/api/games/'+$scope.gameid).success(function(c) {
        $scope.game = c;
      });

    $http.get('/api/bribes').success(function(c) {
        $scope.bribes = c;
      });

     $scope.outcomes = [];
    
    $scope.getOutcomes = function() {
       $http.get('/api/outcomes?game='+$scope.gameid).success(function(outcomes) {
      $scope.outcomes = outcomes;
      socket.syncUpdates('outcome', $scope.outcomes);
    });
    }

    $scope.addOutcome = function() {
      if($scope.newOutcome === '') {
        return;
      }
      $http.post('/api/outcomes', { name: $scope.newOutcome, game: $scope.gameid });
      $scope.newOutcome = '';
      $scope.getOutcomes();
    };

    $scope.deleteOutcome = function(outcome) {
      $http.delete('/api/outcomes/' + outcome._id).then(function(){
        $scope.getOutcomes();  
      });      
    };

   $scope.saveOutcome = function(outcome) {
      $http.put('/api/outcomes/'+outcome._id, outcome).then(function(){
        $scope.getOutcomes();
      })     
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('outcome');
    });

    $scope.getOutcomes();

    // $scope.changePassword = function(form) {
    //   $scope.submitted = true;
    //   if(form.$valid) {
    //     Auth.changePassword( $scope.user.oldPassword, $scope.user.newPassword )
    //     .then( function() {
    //       $scope.message = 'Password successfully changed.';
    //     })
    //     .catch( function() {
    //       form.password.$setValidity('mongoose', false);
    //       $scope.errors.other = 'Incorrect password';
    //       $scope.message = '';
    //     });
    //   }
		// };
  });
