'use strict';

var readline = require('readline');
var trieCompleter = require('readline-trie-completer')();
var commands = require('./commands');
var trie = trieCompleter.trie;

commands.forEach(function (command) {
  trie.insert(command);
});

module.exports = function () {
  var repl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    completer: trieCompleter.completer
  });

  repl.setPrompt(' › ');
  repl.prompt();

  repl.on('SIGINT', function () {
    console.log();
    process.exit(0);
  });

  return repl;
};
