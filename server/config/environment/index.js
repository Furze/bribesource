'use strict';

var path = require('path');
var _ = require('lodash');

function requiredProcessEnv(name) {
  if(!process.env[name]) {
    throw new Error('You must set the ' + name + ' environment variable');
  }
  return process.env[name];
}

// All configurations will extend these options
// ============================================
var all = {
  env: process.env.NODE_ENV,

  // Root path of server
  root: path.normalize(__dirname + '/../../..'),

  // Server port
  port: process.env.PORT || 9000,

  // Should we populate the DB with sample data?
  seedDB: false,

  // Secret for session, you will want to change this and make it an environment variable
  secrets: {
    session: 'story-secret'
  },

  // List of user roles
  userRoles: ['guest', 'user', 'admin'],

  // MongoDB connection options
  mongo: {
    options: {
      db: {
        safe: true
      }
    }
  },
  
  google: {
    clientID:     process.env.GOOGLE_ID || '444090684595-n4po5b8mv86mqjmg0i8onb2pkdctjdvi.apps.googleusercontent.com',
    clientSecret: process.env.GOOGLE_SECRET || 'R0oFAJNNcwgzw0GLm44o5l1J',
    //clientID:     process.env.GOOGLE_ID || '420908109166-hnm731k9t76gmkjg6u6o9cjtgf2ce0hd.apps.googleusercontent.com',
    //clientSecret: process.env.GOOGLE_SECRET || 'xK6IMmJ_qAxKTN2A9jPTx3N5',
    callbackURL:  (process.env.DOMAIN || '') + '/auth/google/callback'
  }
};

// Export the config object based on the NODE_ENV
// ==============================================
module.exports = _.merge(
  all,
  require('./' + process.env.NODE_ENV + '.js') || {});
