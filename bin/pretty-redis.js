#!/usr/bin/env node

var path = require('path');
var chalk = require('chalk');
var updater = require('npm-auto-updater');
var pkg = require('../package');
var prettyRedis = require('../lib/pretty-redis');
var plugins = prettyRedis.plugins;
var repl = require('../lib/repl');
var parsed = require('../lib/opt');
var stop = {}, rl;

updater(path.join(__dirname, '..'))
  .then(main);

function main() {
  help();
  connect();
  initRepl();
  initPrettyRedis();
  rl.prompt();
}

function help() {
  if (parsed.help) {
    console.log();
    console.log('  %s@%s', chalk.cyan(pkg.name), pkg.version);
    console.log();
    console.log('  %s %s -h %s -p %s'
      , chalk.yellow('$')
      , chalk.green('pretty-redis')
      , chalk.cyan('127.0.0.1')
      , chalk.cyan('6379'));
    console.log();
    console.log('  %s %s', '--help, -h\t', 'redis host name');
    console.log('  %s %s', '--port, -p\t', 'redis port number');
    console.log('  %s %s', '--auth, -a\t', 'redis auth key');
    console.log('  %s %s', '--plugin\t', 'Node.js module name or file path');
    console.log();
    process.exit();
  }
}

function connect() {
  var host = parsed.host || '127.0.0.1';
  var port = parsed.port || 6379;
  var auth = parsed.auth;

  prettyRedis = prettyRedis(port, host);
  auth && prettyRedis.auth(auth);
}

function initPrettyRedis() {
  prettyRedis
    .use(plugins.repl({
      open: initRepl,
      close: closeRepl
    }))
    .use(plugins.thirdparty(parsed.plugin))
    .use(plugins.keys())
    .use(plugins.jsonPrettify())
    .use(plugins.xmlPrettify())
    .use(plugins.heighlight())
    .use(plugins.array())
    .use(plugins.object())
    .use(plugins.types())
    .use(plugins.save());
}

function initRepl() {
  rl = repl();
  rl.on('line', exec);
}

function closeRepl() {
  rl.close();
}

function exec(line) {
  if (prettyRedis.lock) {
    return;
  }

  prettyRedis.lock = true;

  prettyRedis.exec(line)
    .then(success)
    .catch(error)
    .then(function () {
      prettyRedis.lock = false;
      rl.prompt();
    });
}

function success(ctx) {
  if (!ctx.data) {
    return;
  }

  console.log();

  if (ctx.type !== 'plain-text' && ctx.type !== 'keys') {
    console.log(chalk.cyan('   (' + ctx.type + ')'));
    console.log();
  }

  console.log(ctx.data.replace(/^/mg, '   '));
  console.log();
}

function error(err) {
  console.log();
  console.log('   %s', chalk.magenta(err.message));
  console.log();
}
