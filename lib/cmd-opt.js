'use strict';

var path = require('path');
var nopt = require('nopt')

var knownOpts = {
  type: String,
  repl: Boolean,
  'save-to': path
};

var shortHands = {
  lang: ['--type']
};

module.exports = function (args) {
  return nopt(knownOpts, shortHands, args, 0);
};
