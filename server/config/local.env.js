'use strict';

// Use local.env.js for environment variables that grunt will set when the server starts locally.
// Use for your api keys, secrets, etc. This file should not be tracked by git.
//
// You will need to set these on the server you deploy to.

module.exports = {
  DOMAIN: 'http://localhost:9000',
  SESSION_SECRET: "story-secret",

  GOOGLE_ID: '444090684595-n4po5b8mv86mqjmg0i8onb2pkdctjdvi.apps.googleusercontent.com',
  GOOGLE_SECRET: 'R0oFAJNNcwgzw0GLm44o5l1J',

  // Control debug level for modules using visionmedia/debug
  DEBUG: ''
};
