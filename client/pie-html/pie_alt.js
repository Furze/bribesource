'use strict';

/* jshint quotmark: false */
/* globals Raphael: true, colr: true */

// useful functions
var utils = {
  // returns a random float
  // x > start && x < end
  randFloat: function (start, end) {
    return Math.random() * (end - start) + start;
  },

  // returns a random int
  // x >= start && x < end
  randInt: function (start, end) {
    return Math.floor(utils.randFloat(start, end));
  },

  // returns a random item from an array
  randIndex: function (array) {
    return array[utils.randInt(0, array.length)];
  },

  shuffle: function () {
    return utils.randFloat(-1, 1);
  },
};

// constants
var SECTOR_ESTIMATE = 12;
var RAD             = Math.PI / 180;
var COLORS          = ['9CE0B1', 'B9EC47', 'F7B15E', 'FB2FC8', '907A9D'].map(colr.fromHex);

// draws a sector of a circle
Raphael.fn.sector = function (cx, cy, r, startAngle, endAngle) {
  var x1 = cx + r * Math.cos(-startAngle * RAD);
  var x2 = cx + r * Math.cos(-endAngle   * RAD);
  var y1 = cy + r * Math.sin(-startAngle * RAD);
  var y2 = cy + r * Math.sin(-endAngle   * RAD);

  return this.path([
    // move to
    'M', cx, cy,
    // line to
    'L', x1, y1,
    // elliptical arc
    'A', r, r, 0, +(endAngle - startAngle > 180), 0, x2, y2,
    // close path (rel)
    'z'
  ]);
};

// draws a pie chart
Raphael.fn.pieChart = function (cx, cy, r, items, stroke) {

  var paper = this;
  var chart = paper.set();

  // calculate total weight
  var total = items.reduce(function (result, item) {
    return result + item.weight;
  }, 0);

  // assign each item a color
  items.forEach(function (item, id) {
    item.color = COLORS[id];
  });

  // calculate number of slices each item gets
  var itemSlices = [];
  items.forEach(function (item, id) {
    var count = Math.round(item.weight / total * SECTOR_ESTIMATE);

    item.slices = [];

    for (var i = 0; i < count; i++) {
      itemSlices.push({
        id: id,
        label: item.label,
        color: item.color,
      });
    }
  });

  // TODO: ensure that every item gets at least one sector

  // TODO: could we shuffle slices in a way that minimises the amount of sectors
  // that are the same color being next to each other?

  // shuffle slices
  // itemSlices.sort(utils.shuffle);

  var sectors     = itemSlices.length;
  var sectorWidth = 360 / sectors;
  var index = 0;

  // draws a section of the pie chart for an item
  var process = function (item) {
    var angle = sectorWidth * index;

    // section
    var p = paper.sector(cx, cy, r, angle, angle + sectorWidth).attr({
      fill: '90-' + item.color.toHex() + '-' + item.color.clone().darken(10).toHex(),
      stroke: stroke,
      'stroke-width': 2,
    });
    p.startAngle = angle;
    p.endAngle = angle + sectorWidth;
    chart.push(p);

    /*
    // labels
    var popangle  = angle + (sectorWidth / 2);

    // how far out to draw labels
    var delta = 50;
    var txt = paper.text(
      cx + (r + delta + 55) * Math.cos(-popangle * RAD),
      cy + (r + delta + 25) * Math.sin(-popangle * RAD),
      item.label
    ).attr({
      fill: item.color.toHex(),
      stroke: 'none',
      opacity: 1,
      'font-size': 20
    });
    chart.push(txt);
    */

    index += 1;
    return p;
  };

  // draw all the slices
  var slices = itemSlices.reduce(function (result, item, index) {
    result.push(process(item));
    items[item.id].slices.push(index);
    return result;
  }, this.set());

  // mid circle
  chart.push(paper.circle(cx, cy, r/5).attr({
    stroke: stroke,
    'stroke-width': 2,
  }));

  // outer circle
  chart.push(paper.circle(cx, cy, r).attr({
    stroke: stroke,
    'stroke-width': 4,
  }));

  // center
  chart.push(paper.circle(cx, cy, r/16).attr({
    fill: stroke,
    stroke: 'none',
  }));

  var lastSpin = 0;

  chart.spin = function (winner) {

    // find index of winner
    var slice = slices[utils.randIndex(items[winner].slices)];

    // pad start and end values so that pointer doesn't stop on a join
    var padding = 2;
    var start = slice.startAngle + padding;
    var end = slice.endAngle - padding;
    var r = utils.randFloat(start, end);

    // how many times to spin
    var spin = lastSpin + (360 * 20) - r;
    lastSpin = spin + r;

    slices.animate({
      transform:'r-' + spin + ',350,350',
    }, 10 * 1000, 'cubic-bezier(0.2, 0, 0, 1)');
  };

  return chart;
};

$(function () {

  var items = [
    {label: 'Story 1', weight: utils.randInt(0, 10)},
    {label: 'Story 2', weight: utils.randInt(0, 10)},
    {label: 'Story 3', weight: utils.randInt(0, 10)},
    {label: 'Story 4', weight: utils.randInt(0, 10)},
    {label: 'Story 5', weight: utils.randInt(0, 10)},
  ];

  // which item to spin to
  var result = utils.randInt(0, items.length);

  var raphael = new Raphael('holder', 700, 700);
  var pieChart = raphael.pieChart(350, 350, 200, items, '#fff');

  $('button').click(function () {
    pieChart.spin(result);
  });
});
