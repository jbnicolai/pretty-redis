'use strict';

module.exports = function () {
  return function (next) {
    if (!Array.isArray(this.data)) {
      return next();
    }

    var data = [];

    this.data.forEach(function (val, index) {
      var msg = '   '
        + index + ') '
        + chalk.cyan(val);

      data.push(msg);
    });

    this.data = data.join('\n');
    this.type = 'array';

    next();
  };
};
