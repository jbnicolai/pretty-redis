'use strict';

module.exports = function () {
  return function (next) {
    if (this.type !== 'plain-text') {
      return next();
    }

    isInt(this)
      || isFloat(this)
      || isUUID(this);

    next();
  };
};

function isInt(ctx) {
  if (/^[-+]?\d+$/.test(ctx.data)) {
    ctx.type = 'Int';
    return true;
  }
}

function isFloat(ctx) {
  if (/^[-+]?\d*\.\d+$/.test(ctx.data)) {
    ctx.type = 'Float';
    return true;
  }
}

function isUUID(ctx) {
  var re = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  if (re.test(ctx.data)) {
    ctx.type = 'UUID';
    return true;
  }
}
