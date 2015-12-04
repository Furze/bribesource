'use strict';

angular.module('storyApp').controller('LandingCtrl', function ($scope, socket, Auth) {
  $scope.checkLoggedIn = function() {
    Auth.isLoggedInAsync(function(val) {
      $scope.isLoggedIn = val;
      if($scope.isLoggedIn) {
        var cu = Auth.getCurrentUser();
        $scope.currentUserImageUrl = cu.google.image.url;
        $scope.currentUserEmail = Auth.getCurrentUser().email;
      }
    });
  }

  // listeners
  $scope.$on('$destroy', function () {
    socket.unsyncUpdates('game');
    socket.unsyncUpdates('thing');
  });

  // initial methods called
  $scope.checkLoggedIn();
});
