'use strict';

module.exports = Context;

function Context(data) {
  this.cmd = data.cmd.toLowerCase();
  this.args = data.args;
  this.filters = data.filters;
  this.parsed = data.parsed;
  this.type = 'plain-text';
  this._stop = false;
}

Context.prototype.stop = function () {
  this._stop = true;
  return this;
};

Context.prototype.stopped = function () {
  return this._stop;
};

Context.prototype.hasFilter = function (name) {
  return this.filters.hasOwnProperty(name);
};
