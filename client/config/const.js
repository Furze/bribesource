'use strict';

var config = {
  'issuesUrl': 'https://trello.com/b/Nj4KVFIe/bribe-myventure'
};

var txt = {
  'game': 'sprint',
  'games': 'sprints',
  'outcome': 'story',
  'outcomes': 'stories'
}

angular.module('storyApp')
  .run(function($rootScope) {
    $rootScope.config = config;
  })
  .run(function($rootScope) {
    for (var key in txt) {
      $rootScope['_' + key + '_'] = txt[key];
      $rootScope['_' + capitalize(key) + '_'] = capitalize(txt[key]);
      $rootScope['_' + capitalizeFirst(key) + '_'] = capitalizeFirst(txt[key]);
    }
  })
;

function capitalize(str) {
  return str.toUpperCase();
}

function capitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
