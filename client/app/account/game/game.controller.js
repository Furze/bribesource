'use strict';

angular.module('storyApp')
  .controller('GameCtrl', function ($scope, User, Auth, $stateParams , $http , socket) {
    $scope.errors = {};

    $scope.newBribe={value:''};
    $scope.newInvite={value: ''};
    $scope.newOutcome={value: ''};

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
      if($scope.newOutcome.value === '') {
        return;
      }
      $http.post('/api/outcomes', { name: $scope.newOutcome.value, game: $scope.gameid });
      $scope.newOutcome.value = '';
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

    $scope.getBribes = function() {
      $http.get('/api/bribes?game='+$scope.gameid).success(function(bribes) {
      $scope.bribes = bribes;
      socket.syncUpdates('bribe', $scope.bribes);
    });
    }
    
  
    $scope.addBribe = function() {
      if($scope.newBribe.value == '') {
        return;
      }
      $http.post('/api/bribes', { name: $scope.newBribe.value, game: $scope.gameid }).success(function(){
        $scope.getBribes();
        $scope.newBribe.value = '';
      })      
    };

   $scope.saveBribe = function(bribe) {
      $http.put('/api/bribes/'+bribe._id, bribe);      
    };

    $scope.deleteBribe = function(bribe) {
      $http.delete('/api/bribes/' + bribe._id).success(function(){
        $scope.getBribes();
      })
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('bribe');
    });

        $scope.range = function(min, max) {
            var a = [];
            for(var i = min; i <= max; i++) {
                a[i] = i;
            }
            return a;
        };

    $scope.getBribes();


    $scope.invitations = [];
    
    $scope.addInvite = function() {
        if($scope.newInvite.value == '') {
          return;
        }
        $scope.game.invitations.push({email: $scope.newInvite.value});     
        $scope.newInvite.value = '';   
        $http.put('/api/games/'+$scope.game._id, $scope.game);        
    };

    $scope.sendInvitations = function() {
      for(var i=0;i<$scope.game.invitations.length;i++){
        var i = $scope.game.invitations[i];
        i.sent=true;
         $http.put('/api/games/'+$scope.game._id, $scope.game);   
      }
    };

    $scope.deleteInvite = function(invite) {
      for(var i=0;i<$scope.game.invitations.length;i++){
        var i = $scope.game.invitations[i];
        if(i.email.valueOf()===invite.email.valueOf()){
          $scope.game.invitations.splice(i,1);
        }
      }
    };

  });
