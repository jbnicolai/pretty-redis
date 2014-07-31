'use strict';

var hicat = require('hicat');

module.exports = function () {
  return function (next) {
    var hl = this.hasFilter('hicat')
      || this.hasFilter('hl')
      || this.hasFilter('highlight');

    if (!(typeof this.data === 'string' && hl)) {
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
