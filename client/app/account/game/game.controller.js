'use strict';

angular.module('storyApp')
  .controller('GameCtrl', function ($scope, User, Auth, $stateParams , $http , socket, PieService, $interval) {

    $scope.errors = {};
    $scope.time = {
        hours: '00',
        minutes: '00',
        seconds: '00',
    };

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
      $scope.play();
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
       $scope.renderTime(outcome);

      $http.put('/api/outcomes/'+outcome._id, outcome).then(function(){
        $scope.getOutcomes();
      })     
    };

    var format = function (n) {
        if (n < 0) { n += 1; }
        return Math.floor(n).toString();
    };

    var clockInterval = null;
    $scope.renderTime = function (outcome) {
        if (clockInterval !== null) {
            $interval.cancel(clockInterval);
        }

        clockInterval = $interval(function () {
            var time = 0;
            if (typeof outcome.time !== 'undefined') {
                time = (outcome.time - Date.now()) / 1000;
            }
            $scope.time.days    = format(time / 60 / 60 / 24);
            $scope.time.hours   = format((time / 60 / 60) % 24);
            $scope.time.minutes = format((time / 60) % 60);
            $scope.time.seconds = format(time % 60);
        }, 1000);
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


        $scope.play = function() {

            var params = {};
            var items = [];

            for(var i=0;i<$scope.outcomes.length;i++){
                var outcome = $scope.outcomes[i];
                var bribeValue = 0;
                for (var j=0; j < $scope.bribes.length; j++) {
                    if ($scope.bribes[j]._id === outcome.bribe) {
                        bribeValue = $scope.bribes[j].value;
                    }
                }
                var item = {
                    name: outcome.name,
                    weight: bribeValue,
                    color: PieService.colors[i % PieService.colors.length],
                };
                items.push(item);
            }

            params.items = items;

            PieService.render('holder', items);
        }

  });
