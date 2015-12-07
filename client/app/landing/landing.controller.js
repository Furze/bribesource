'use strict';

angular.module('storyApp').controller('LandingCtrl', function ($scope, $timeout, Auth) {
  $scope.checkLoggedIn = function() {
    Auth.isLoggedInAsync(function(val) {
      $scope.isLoggedIn = val;
      if($scope.isLoggedIn) {
        var cu = Auth.getCurrentUser();
        $scope.currentUserImageUrl = cu.google.image.url;
        $scope.currentUserEmail = Auth.getCurrentUser().email;
      }
			if(localStorage.getItem('participateGame')) {
				$location.path('/game/' + localStorage.getItem('participateGame'));
			}
			$timeout(function() {
				window.hideLoader();
			},1000);
    });
  }
	
	jQuery('body').addClass('landing');
  // initial methods called
  $scope.checkLoggedIn();
});
