'use strict';

angular.module('storyApp')
  .controller('GameCtrl', function ($scope, User, Auth, $stateParams , $http , socket) {
    $scope.errors = {};

    $scope.gameid = $stateParams.id

    $http.get('/api/games/'+$scope.gameid).success(function(c) {
        $scope.game = c;
        $scope.checkGameCreator();
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

    $scope.checkGameCreator = function() {
      Auth.isLoggedInAsync(function(val) {
        $scope.isLoggedIn = val;
        if($scope.isLoggedIn) {
          var cu = Auth.getCurrentUser();          
          $scope.currentUserEmail = Auth.getCurrentUser().email;   
          if($scope.currentUserEmail==$scope.game.gameCreator){
            $scope.currentUserIsGameCreator=true;
          }          
        }
      });
    }
    
    $scope.bribes = [];
    
    $http.get('/api/bribes?game='+$scope.gameid).success(function(bribes) {
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
