'use strict';

var chalk = require('chalk');

module.exports = function () {
  return function (next) {
    if (this.cmd !== 'keys') {
      return next();
    }

    var data = this.data;
    var tree = {};

    var push = function (key) {
      var tmp = key.split(':');
      var last = tmp.pop();
      var parent_ = tree;

      tmp.forEach(function (key) {
        if (!parent_.hasOwnProperty(key)) {
          parent_[key] = {};
        }
        parent_ = parent_[key];
      });

      parent_[last] = null;
    };

    data.forEach(push);

    data = [];

    var log = function (indent, msg) {
      while (indent--) {
        msg = ' ' + msg;
      }
      data.push(msg);
    }

    var printTree = function (indent, prefix, tree) {
      var keys = Object.keys(tree);
      var counter = 0;

      if (!keys.length) {
        return;
      }
      
      keys.forEach(function (key, index) {
        if (tree[key]) {
          log(indent, chalk.yellow(prefix + key));
          printTree(indent + 2, prefix + key + ':', tree[key]);
        } else {
          log(indent, (counter++) + ') ' + chalk.cyan(prefix + key));
        }
      });
    };

    printTree(0, '', tree);

    this.type = 'keys';
    this.data = data.join('\n');

    this.stop();
    next();
  };
};
