'use strict';

module.exports = function () {
  return function (next) {
    if (!(this.type === 'plain-text' || typeof this.data === 'string')) {
      return next();
    }

    if (!/^\s*[\{\[]/.test(this.data)) {
      return next();
    }

    try {
      this.data = JSON.parse(this.data);
      this.data = JSON.stringify(this.data, null, 2);
    } catch (e) {
      return next();
    }

    this.type = 'json';

    next();
  };
};
