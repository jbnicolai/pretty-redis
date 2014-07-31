'use strict';

module.exports = function (middleware) {
  middleware || (middleware = []);

  return function (ctx, cb) {
    var i = 0;

    var next = function (err) {
      var fn = middleware[i++];

      if (err) {
        return cb(err);
      }

      if (ctx.stopped() || !fn) {
        return cb(null, ctx);
      }

      try {
        fn.call(ctx, next);
      } catch (e) {
        return next(e);
      }
    };

    next();
  };
};
