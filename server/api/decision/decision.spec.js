'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');

describe('POST /api/decision/runDecisionSimulation', function() {

  it('should respond with results array', function(done) {
    request(app)
      .post('/api/decision/runDecisionSimulation')
      .send({
        'items': [{
          name: "blue",
          weight: 23
        }]
      })
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.results.should.be.instanceof(Array);
        console.log(res.body);
        done();
      });
  });
});