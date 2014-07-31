'use strict';

module.exports = function () {
  return function (next) {
    if (typeof this.data !== 'object') {
      return next();
    }
    this.data = String(this.data);
    next();
  };
};
