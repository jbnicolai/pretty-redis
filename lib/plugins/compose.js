'use strict';

var compose = require('../compose');

module.exports = function (plugins) {
  var fn = compose(plugins);
  return function (next) {
    fn(this, next);
  };
};
