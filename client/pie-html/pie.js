/* jshint quotmark: false */
/* globals Raphael: true*/


Raphael.fn.pieChart = function(cx, cy, r, data, stroke) {
  "use strict";
  var paper = this,
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
      var value = data[j].value,
        angleplus = 360 * value / total,
        popangle = angle + (angleplus / 2),
        color = Raphael.hsb(start, 0.75, 1),
        delta = 30,
        bcolor = Raphael.hsb(start, 1, 1),

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
      console.log("endAngle = ", (angle + angleplus));
      p.startAngle = angle;
      p.endAngle = (angle + angleplus);
      angle += angleplus;
      chart.push(p);
      chart.push(txt);
      start += 0.1;
      return p;
    };

  for (var i = 0, ii = data.length; i < ii; i++) {
    total += data[i].value;
  }

  for (i = 0; i < ii; i++) {
    var slice = process(i);
    console.log('slice = ', slice);
    slices.push(slice);
  }
  chart.spin = function() {
    var result = function(slice) {
      console.log("slice.endAngle, slice.startAngle = ", slice.endAngle, slice.startAngle);
      var r = Math.random() * (slice.endAngle - slice.startAngle) + slice.startAngle;
      return (360 * 10) - r;
    };
    console.log('slices = ', slices);
    slices.stop().animate({
      transform: "r-" + result(slices.items[2]) + ",350,350"
    }, 5000, "<>");
  };
  return chart;
};

$(function() {
  "use strict";
  var data = [{
    value: 40,
    label: 'Story 1'
  }, {
    value: 26,
    label: 'Story 2'
  }, {
    value: 5,
    label: 'Story 3'
  }, {
    value: 5,
    label: 'Story 4'
  }];

  var total = 0;
  $.each(data, function() {
    total += this;
  });

  var pieChart = new Raphael("holder", 700, 700).pieChart(350, 350, 200, data, "#fff");

  $("button").click(function() {
    pieChart.spin();
  });

});
