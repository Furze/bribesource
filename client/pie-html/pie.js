/* jshint quotmark: false */
/* globals Raphael: true*/


Raphael.fn.pieChart = function(cx, cy, r, values, data, stroke) {

  var paper = this,
    // slices = [],
    slices = paper.set(),
    rad = Math.PI / 180,
    chart = this.set();

  function sector(cx, cy, r, startAngle, endAngle, params) {
    var x1 = cx + r * Math.cos(-startAngle * rad),
      x2 = cx + r * Math.cos(-endAngle * rad),
      y1 = cy + r * Math.sin(-startAngle * rad),
      y2 = cy + r * Math.sin(-endAngle * rad);
    return paper.path(["M", cx, cy, "L", x1, y1, "A", r, r, 0, +(endAngle - startAngle > 180), 0, x2, y2, "z"]).attr(params);
  }


  var angle = 0,
    total = 0,
    start = 0,
    process = function(j) {
      console.log('j = ', j);


      var value = values[j],
          angleplus = 360 * value / total,
          popangle = angle + (angleplus / 2),
          color = Raphael.hsb(start, .75, 1),
          delta = 30,
          bcolor = Raphael.hsb(start, 1, 1),


          // sector(cx, cy, r, startAngle, endAngle, params

          p = sector(cx, cy, r, angle, angle + angleplus, {
            fill: "90-" + bcolor + "-" + color,
            stroke: stroke,
            "stroke-width": 3
          }),
          txt = paper.text(cx + (r + delta + 55) * Math.cos(-popangle * rad), cy + (r + delta + 25) * Math.sin(-popangle * rad), data[j].label).attr({
            fill: bcolor,
            stroke: "none",
            opacity: 0,
            "font-size": 20
          });

          console.log("startAngle = ", angle);
          console.log("endAngle = ", (angle + angleplus) );


          p.startAngle = angle;
          p.endAngle = (angle + angleplus);






          angle += angleplus;
          chart.push(p);
          chart.push(txt);
          start += .1;






          return p;
        };
        
        for (var i = 0, ii = values.length; i < ii; i++) {
          total += values[i];
        }

        for (i = 0; i < ii; i++) {
          var slice = process(i);

          console.log('slice = ', slice);



          slices.push(slice);

        }


      chart.spin = function() {
        // var anim = Raphael.animation({cx: 900, cy: 99999}, 2e3);



        var result = function (slice) {

          console.log("slice.endAngle, slice.startAngle = ", slice.endAngle, slice.startAngle);



          var r = Math.random() * (slice.endAngle - slice.startAngle) + slice.startAngle;
          return (360 * 10) - r;
        };


        console.log('slices = ', slices);



        slices.stop().animate({
            transform:"r-" + result(slices.items[2]) + ",350,350"
          }, 5000, "<>");
      };





        return chart;
      };



$(function() {

  var values = [40, 26, 5, 5];
  // var labels = ['Story 1', 'Story 2', 'Story 3', 'Story 4'];

  var data = [{
    value: 40,
    label: 'Story 1'
  },{
    value: 26,
    label: 'Story 2'
  },{
    value: 5,
    label: 'Story 3'
  },{
    value: 5,
    label: 'Story 4'
  }]; 
  

  var total = 0;

  $.each(values, function() {
    total += this;
  });


  var pieChart = Raphael("holder", 700, 700).pieChart(350, 350, 200, values, data, "#fff");
  
  $("button").click(function() {
    pieChart.spin();
    // var anim = Raphael.animation({cx: 600, cy: 600}, 2e3);

    // pieChart.animate(anim); // run the given animation immediately

    // pieChart.spin();

  });

});
