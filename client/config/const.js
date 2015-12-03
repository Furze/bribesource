'use strict';

var config = {
  'issuesUrl': 'https://trello.com/b/Nj4KVFIe/bribe-myventure'
};

angular.module('storyApp')
  .constant('config', config)
  .run(function($rootScope, config) {
      $rootScope.config = config;
    })
;
