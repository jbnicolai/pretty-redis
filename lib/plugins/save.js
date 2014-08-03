'use strict';

var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');

module.exports = function () {
  return function (next) {
    var file = this.parsed['save-to'];

    if (!file) {
      return next();
    }

    var dirname = path.dirname(file);
    var content = this.data;

    mkdirp(dirname, function (err) {
      if (err) {
        return next(err);
      }
      fs.writeFile(file, content, next);
    });
  };
};
