'use strict';

angular.module('storyApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('landing', {
        url: '/',
        templateUrl: 'app/landing/landing.html',
        controller: 'LandingCtrl'
      });
  });