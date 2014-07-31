'use strict';

var hicat = require('hicat');

module.exports = function () {
  return function (next) {
    if (typeof this.data !== 'string') {
      return next();
    }

    var options = {};

    if (this.type !== 'plain-text') {
      options.lang = this.type;
    }

    try {
      this.data = hicat(this.data, options).ansi;
    } catch (e) {}

    next();
  };
};
