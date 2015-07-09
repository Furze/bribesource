'use strict';

angular.module('storyApp')
  .controller('AdminCtrl', function ($scope, $http, Auth, User, socket) {

    // Use the User $resource to fetch all users
    $scope.users = User.query();

    $scope.delete = function(user) {
      User.remove({ id: user._id });
      angular.forEach($scope.users, function(u, i) {
        if (u === user) {
          $scope.users.splice(i, 1);
        }
      });
    };


  $scope.bribes = [];
    
    $http.get('/api/bribes').success(function(bribes) {
      $scope.bribes = bribes;
      socket.syncUpdates('bribe', $scope.bribes);
    });

    $scope.addBribe = function() {
      if($scope.newBribe === '') {
        return;
      }
      $http.post('/api/bribes', { name: $scope.newBribe });
      $scope.newBribe = '';
    };

   $scope.saveBribe = function(bribe) {
      $http.put('/api/bribes/'+bribe._id, bribe);      
    };


    $scope.deleteBribe = function(bribe) {
      $http.delete('/api/bribes/' + bribe._id);
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('bribe');
    });



  });
