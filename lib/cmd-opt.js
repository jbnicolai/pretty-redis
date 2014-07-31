'use strict';

var nopt = require('nopt')

var knownOpts = {
  type: String
};

var shortHands = {
  lang: ['--type']
};

module.exports = function (args) {
  return nopt(knownOpts, shortHands, args, 0);
};
