'use strict';

var path = require('path');
var compose = require('./compose');

module.exports = function (plugins) {
  plugins || (plugins = []);

  plugins = plugins.map(function (plugin) {
    if (/^\.*\//.test(plugin)) {
      return require(path.resolve(process.cwd(), plugin));
    }
    return require(plugin);
  });

  return compose(plugins);
};
