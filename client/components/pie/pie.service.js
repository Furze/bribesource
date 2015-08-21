'use strict';

angular.module('storyApp')
  .factory('PieService', function pieservice($rootScope) {


return {

  renderPie: function(labels,values) {

    // var values = [40, 26, 5, 5];
    // var labels = ['Story 1', 'Story 2', 'Story 3', 'Story 4'];

    // var total = 0;
    // $.each(values, function() {
    //   total += this;
    // });

    var pieChart = Raphael("holder", 700, 700).pieChart(350, 450, 200, values, labels, "#fff");
  }

 
 } 
});
