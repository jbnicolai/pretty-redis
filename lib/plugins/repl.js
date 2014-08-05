'use strict';

var vm = require('vm');
var repl = require('repl');

module.exports = function (options) {
  options || (options = {});

  var open = options.open;
  var close = options.close;
  var gl = Object.create(global);

  gl.__dirname = process.cwd();

  return function (next) {
    if (!this.parsed.repl) { 
      return next();
    }

    close && close();
    this.stop();

    var ctx = vm.createContext(gl);
    ctx.data = this.data;
    ctx.redis = this.prettyRedis.client;
    ctx.module = module;
    ctx.require = module.require;

    var r = repl.start({
      prompt: ' js › ',
      input: process.stdin,
      output: process.stdout
    });

    r.context = ctx;

    r.on('exit', function () {
      this.data = null;
      open && open();
      next();
    }.bind(this));
  };
};
