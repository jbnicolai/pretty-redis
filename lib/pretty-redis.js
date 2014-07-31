'use strict';

var redis = require('redis');
var Promise = require('native-or-bluebird');
var Emitter = require('events').EventEmitter;
var parse = require('str2argv');
var commands = require('./commands');
var Context = require('./context');
var plugins = require('./plugins');
var cmdOpt = require('./cmd-opt');
var compose = require('./compose');

module.exports = PrettyRedis;

function PrettyRedis(port, host, args) {
  if (!(this instanceof PrettyRedis)) {
    return new PrettyRedis(port, host, args);
  }
  this.client = redis.createClient(port, host, args);
  this.middleware = [];
}

PrettyRedis.Context = Context;
PrettyRedis.plugins = plugins;

PrettyRedis.prototype.auth = function (auth) {
  this.client.auth(auth);
  return this;
};

PrettyRedis.prototype.use = function (fn) {
  this.middleware.push(fn);
  return this;
};

PrettyRedis.prototype.exec = function (line) {
  line = line.trim();

  var ctx = this.parse(line);

  return this.cmd(ctx);
};

PrettyRedis.prototype.cmd = function (ctx) {
  var setData = function (data) {
    ctx.data = data;
    return ctx;
  };

  return this.redisCmd(ctx.cmd, ctx.args)
    .then(setData)
    .then(this.runMiddleware.bind(this))
};

PrettyRedis.prototype.runMiddleware = function (ctx) {
  var fn = compose(this.middleware);
  return new Promise(function (resolve, reject) {
    fn(ctx, function (err) {
      if (err) {
        return reject(err);
      }
      resolve(ctx);
    });
  });
};

PrettyRedis.prototype.redisCmd = function (cmd, args) {
  var client = this.client;

  args = args.slice();

  return new Promise(function (resolve, reject) {
    if (!~commands.indexOf(cmd)) {
      return reject(new Error('Command not found: ' + cmd));
    }

    args.push(function (err, result) {
      if (err) {
        return reject(err);
      }
      resolve(result);
    });

    client[cmd].apply(client, args);
  });
};

PrettyRedis.prototype.parse = function (line) {
  var argv = parse(line);
  var args = null;
  var filters = {};
  var tmp = [];
  var cmd = argv.shift().toLowerCase();
  var opt;

  argv.forEach(function (arg) {
    if (arg === '|') {
      if (args) {
        filters[tmp.shift()] = args;
      } else {
        args = tmp;
      }

      tmp = [];
      
      return;
    }

    tmp.push(arg);
  });

  if (args) {
    filters[tmp.shift()] = tmp;
  } else {
    args = tmp;
  }

  opt = cmdOpt(args);

  return new Context({
    cmd: cmd,
    args: opt.argv.remain,
    parsed: opt,
    filters: filters
  });
};
