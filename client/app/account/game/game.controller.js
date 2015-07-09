'use strict';

angular.module('storyApp')
  .controller('GameCtrl', function ($scope, User, Auth, $stateParams , $http ) {
    $scope.errors = {};

    $scope.gameid = $stateParams.id

    $http.get('/api/game/'+$scope.gameid).success(function(c) {
        $scope.game = c;
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
