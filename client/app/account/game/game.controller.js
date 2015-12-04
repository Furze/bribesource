'use strict';

angular.module('storyApp').controller('GameCtrl', function ($scope, User, Auth, $stateParams, $location, $window, $http, socket, PieService, $interval, $timeout) {

  var format = function (n) {
    if (n < 0) {
      n += 1;
    }
    return Math.floor(n).toString();
  };

  var clockInterval = null;

  $scope.errors = {};
  $scope.time = {
    hours: '00',
    minutes: '00',
    seconds: '00',
  };

  $scope.newBribe = {value: ''};
  $scope.newInvite = {value: ''};
  $scope.newOutcome = {value: ''};

  $scope.outcomes = [];
  $scope.bribes = [];
  $scope.invitations = [];

  $scope.gameid = $stateParams.id

  $scope.$on('$destroy', function () {
    socket.unsyncUpdates('outcome');
  });

  $scope.$on('$destroy', function () {
    socket.unsyncUpdates('bribe');
  });

  $scope.getOutcomes = function () {
    $http.get('/api/outcomes?game=' + $scope.gameid).success(function (outcomes) {
      $scope.outcomes = outcomes;
      socket.syncUpdates('outcome', $scope.outcomes);
      if ($scope.bribes.length > 0) {
        $scope.play();
      }
    });
  };

  $scope.addOutcome = function () {
    if ($scope.newOutcome.value === '') {
      return;
    }
    $http.post('/api/outcomes', {name: $scope.newOutcome.value, game: $scope.gameid});
    $scope.newOutcome.value = '';
    $scope.getOutcomes();
  };

  $scope.deleteOutcome = function (outcome) {
    $http.delete('/api/outcomes/' + outcome._id).then(function () {
      $scope.getOutcomes();
    });
  };

  $scope.saveOutcome = function (outcome) {
    $scope.renderTime(outcome);

    $http.put('/api/outcomes/' + outcome._id, outcome).then(function () {
      $scope.getOutcomes();
    })
  };

  $scope.renderTime = function (outcome) {
    if (clockInterval !== null) {
      $interval.cancel(clockInterval);
    }

    clockInterval = $interval(function () {
      var time = 0;
      if (typeof outcome.time !== 'undefined') {
        time = (outcome.time - Date.now()) / 1000;
      }
      $scope.time.days = format(time / 60 / 60 / 24);
      $scope.time.hours = format((time / 60 / 60) % 24);
      $scope.time.minutes = format((time / 60) % 60);
      $scope.time.seconds = format(time % 60);
    }, 1000);
  };

  $scope.checkGameCreator = function () {
    Auth.isLoggedInAsync(function (val) {
      $scope.isLoggedIn = val;
      if ($scope.isLoggedIn) {
        var cu = Auth.getCurrentUser();
        $scope.currentUserEmail = Auth.getCurrentUser().email;
        if ($scope.currentUserEmail == $scope.game.gameCreator) {
          $scope.currentUserIsGameCreator = true;
        }
      }
      $scope.checkIsParticipant();
      $scope.checkAndAddParticipant();
      $timeout(function () {
        window.hideLoader();
      }, 1000);
    });
  };

  $scope.checkIsParticipant = function () {
    $scope.isParticipant = _.findIndex($scope.game.participants, {email: $scope.currentUserEmail}) > -1;
  }

  $scope.checkAndAddParticipant = function () {
    // ?participate in url - store gameid in localStorage for redirection later on and redirect user
    // else if logged in and game exists in localStorage, add user to game participants list 
    if ($location.search().participate) {
      localStorage.setItem('participateGame', $scope.gameid);
      $window.location.href = '/auth/google';
    } else if (localStorage.getItem('participateGame')) {
      if ($scope.isLoggedIn) {
        $scope.addParticipant();
      }
      localStorage.removeItem('participateGame');
    }
  }

  $scope.getBribes = function () {
    $http.get('/api/bribes?game=' + $scope.gameid).success(function (bribes) {
      _.each(bribes, function (bribe) {
        if (bribe.value) {
          bribe.value = bribe.value.toString();
        }
      })
      $scope.bribes = bribes;
      socket.syncUpdates('bribe', $scope.bribes);
      if ($scope.outcomes.length > 0) {
        $scope.play();
      }
    });
  };

  $scope.addBribe = function () {
    if ($scope.newBribe.value == '') {
      return;
    }
    $http.post('/api/bribes', {name: $scope.newBribe.value, game: $scope.gameid}).success(function () {
      $scope.getBribes();
      $scope.newBribe.value = '';
    })
  };

  $scope.saveBribe = function (bribe) {
    $http.put('/api/bribes/' + bribe._id, bribe).success(function() {
    	$scope.play();
    });
  };

  $scope.deleteBribe = function (bribe) {
    $http.delete('/api/bribes/' + bribe._id).success(function () {
      $scope.getBribes();
    })
  };

  $scope.range = function (min, max) {
    var a = [];
    for (var i = min; i <= max; i++) {
      a[i] = i;
    }
    return a;
  };

  $scope.addInvite = function () {
    if ($scope.newInvite.value == '') {
      return;
    }
    $http.post('/api/games/' + $scope.game._id + '/invite', {email: $scope.newInvite.value}).then(function (response) {
      $scope.game = response.data;
      $scope.newInvite.value = '';
    });
  };

  $scope.addParticipant = function () {
    if ($scope.isLoggedIn) {
      var participants = $scope.game.participants || [];
      var exists = _.findIndex($scope.game.participants, {email: $scope.currentUserEmail});
      // if doesn't exist
      if (exists === -1) {
        $http.post('/api/games/' + $scope.game._id + '/participant', {email: $scope.currentUserEmail}).then(function (response) {
          $scope.game = response.data;
          $scope.checkIsParticipant();
        });
      }
    } else {
      window.location = '/game/' + $scope.gameid + '?participate=true';
    }
  }

  $scope.deleteInvite = function (invite) {
    $http.delete('/api/games/' + $scope.game._id + '/invite/' + invite._id).then(function (response) {
      $scope.game = response.data;
    });
  };

  $scope.deleteParticipant = function (participant) {
    $http.delete('/api/games/' + $scope.game._id + '/participant/' + participant._id).then(function (response) {
      $scope.game = response.data;
    });
  };

  $scope.sendInvitations = function () {
    for (var i = 0; i < $scope.game.invitations.length; i++) {
      var i = $scope.game.invitations[i];
      i.sent = true;
      $http.put('/api/games/' + $scope.game._id + '/invite', $scope.game).then(function (response) {
        $scope.game = response.data;
      });
    }
  };


  $scope.saveGame = function (game) {
    game.gamePlayDate = $scope.gameDate;
    $http.put('/api/games/' + game._id, game).then(function (response) {
      $scope.game = response.data;
    });
  };
	
	
	$scope.getBribeValue = function(bribeId) {
		var value = '';
		_.each($scope.bribes, function(bribe) {
			if(bribe._id === bribeId) {
				value = bribe.value;
			}
		})
		return value;
	}

  $scope.play = function () {
    var params = {};
    var items = [];
    for (var i = 0; i < $scope.outcomes.length; i++) {
      var outcome = $scope.outcomes[i];
      var bribeValue = 0;
      for (var j = 0; j < $scope.bribes.length; j++) {
        if ($scope.bribes[j]._id === outcome.bribe) {
          bribeValue = Number($scope.bribes[j].value);
        }
      }
      var item = {
        name: outcome.name,
        weight: bribeValue,
        color: PieService.colors[i % PieService.colors.length],
      };
      items.push(item);
      var color = PieService.rawColors[i % PieService.colors.length];
      outcome.color = '#' + color;
    }
    params.items = items;
		try {
	    $timeout(function () {
	      PieService.render('holder', items);
	    }, 0);
		} catch(exception) {
		
		}
  }

  $http.get('/api/games/' + $scope.gameid).success(function (c) {
    $scope.game = c;
    $scope.gameDate = new Date($scope.game.gamePlayDate);
    $scope.checkGameCreator();
  });

  $scope.getOutcomes();
  $scope.getBribes();

});
