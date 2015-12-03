'use strict';

/* jshint quotmark: false */
/* globals Raphael: true */

angular.module('storyApp')
.factory('PieService', function pieservice ($rootScope) {

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
    var SECTOR_ESTIMATE = 16;
    var RAD             = Math.PI / 180;

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

    Raphael.fn.sectorLine = function (cx, cy, r, angle) {
        var x1 = cx + r * Math.cos(-angle * RAD);
        var y1 = cy + r * Math.sin(-angle * RAD);

        return this.path([
            // move to
            'M', cx, cy,
            // line to
            'L', x1, y1,
        ]);
    }

    // draws a pie chart
    Raphael.fn.pieChart = function (cx, cy, r, items, stroke) {
        var paper = this;
        var elements = [];
        var chart = paper.set();

        // calculate total weight
        var total = items.reduce(function (result, item) {
            return result + item.weight;
        }, 0);

        // calculate number of slices each item gets
        var sectors = 0;
        items.forEach(function (item) {
            // TODO: ensure that every item gets at least one sector
            var count = Math.round(item.weight / total * SECTOR_ESTIMATE);

            if (count === 0) {
                count = 1;
            }

            item.count = count;
            sectors += count;
        });

        var sectorWidth = 360 / sectors;

        // draws a section of the pie chart for an item
        var index = 0;
        var process = function (item) {
            var angle = sectorWidth * index;
            var endAngle = angle + (sectorWidth * item.count);
            index += item.count;

            item.startAngle = angle;
            item.endAngle = endAngle

            // section
            var sector = paper.sector(cx, cy, r, angle, endAngle).attr({
                fill: '90-' + item.color.toHex() + '-' + item.color.clone().darken(10).toHex(),
                stroke: stroke,
                'stroke-width': 2,
            });
            elements.push(sector);

            for (var i = 1; i < item.count; i++) {
                elements.push(paper.sector(cx, cy, r, angle + (sectorWidth * i)).attr({
                    stroke: item.color.clone().lighten(10).toHex(),
                    'stroke-width': 1,
                }));
            }

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

            return elements;
        };

        // draw all the slices
        var pie = items.reduce(function (result, item, index) {
            process(item).forEach(function (element) {
                result.push(element);
            });
            return result;
        }, this.set());

        // center
        chart.push(paper.circle(cx, cy, r/16).attr({
            fill: stroke,
            stroke: 'none',
        }));

        var lastSpin = 0;

        chart.spin = function (winner, done) {

            // find index of winner
            var slice = items[winner];

            // pad start and end values so that pointer doesn't stop on a join
            var padding = 2;
            var start = slice.startAngle + padding;
            var end = slice.endAngle - padding;
            var r = utils.randFloat(start, end);

            // how many times to spin
            var spin = lastSpin + (360 * 20) - r;
            lastSpin = spin + r;

            var animationTime = 18 * 1000;

            pie.animate({
                transform:'r' + spin + ',350,350',
            }, animationTime, 'cubic-bezier(0.1, 0, 0, 1)');

            setTimeout(done, animationTime);
        };

        return chart;
    };

    return {
	      rawColors: [
	          '2196f3',
	          '4caf50',
	          '9c27b0',
	          'ff9800',
	          'e51c23'
	      ],
        colors: [   
					'2196f3',
          '4caf50',
          '9c27b0',
          'ff9800',
          'e51c23'
        ].map(colr.fromHex),
        render: function(elementID, items) {
            var raphael = new Raphael(elementID, 700, 700);
            var pieChart = raphael.pieChart(350, 350, 200, items, '#fff');
            return pieChart;
        },
    }; 
});
