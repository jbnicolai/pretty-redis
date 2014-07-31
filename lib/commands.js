'use strict';

var commands = require('redis/lib/commands');
var proto = require('redis').RedisClient.prototype;

module.exports = commands.filter(function (command) {
  return proto.hasOwnProperty(command);
});
