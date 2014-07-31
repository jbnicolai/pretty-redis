'use strict';

var beautify = require('js-beautify').html;

module.exports = function () {

  // command:
  //     > get html:home | html

  return function (next) {
    if (!~['xml', 'html'].indexOf(this.parsed.type)) {
      return next();
    }

    var data = String(this.data);

    try {
      this.data = beautify(data);
    } catch (e) {
      return next(e);
    }

    if (/\^\s*<!\s*DOCTYPE\s+html.*?>/i) {
      this.type = 'html';
    } else {
      this.type = 'xml';
    }

    next();
  };
};
