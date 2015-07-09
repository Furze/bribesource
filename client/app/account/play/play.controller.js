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

    $scope.addOutcome = function() {
      if($scope.newOutcome === '') {
        return;
      }
      $http.post('/api/outcomes', { name: $scope.newOutcome });
      $scope.newOutcome = '';
    };

    $scope.deleteOutcome = function(outcome) {
      $http.delete('/api/outcomes/' + outcome._id);
    };

   $scope.saveOutcome = function(outcome) {
      $http.put('/api/outcomes/'+outcome._id, outcome);      
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('outcome');
    });

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
