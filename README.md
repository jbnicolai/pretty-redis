pretty-redis
------------

`pretty-redis` is a cli client for redis, which is beautiful and very simple.

```bash
$ npm i -g pretty-redis
```
[![MPM](https://nodei.co/npm/pretty-redis.png?downloads=true&stars=true)](http://npmjs.org/pretty-redis)

![screencast](https://raw.githubusercontent.com/poying/pretty-redis/master/screencast.gif)

```bash
pretty-redis@0.1.0-alpha

$ pretty-redis -h 127.0.0.1 -p 6379

--help, -h	 redis host name
--port, -p	 redis port number
--auth, -a	 redis auth key
--plugin	 Node.js module name or file path
```

## Usage

You can use `pretty-redis` as `redis-cli` in most cases:

```bash
 › keys *
 › set key value
 › get key
```

It will only prettify json format. If you want to prettify other language/type, you can specify the language/type by using `--lang` option:

```bash
 › get html --lang=html
```

It's already better then `redis-cli` but not pretty enough. So use `highlight` (alias: `hl`, `hicat`) filter to make it even better:

```bash
 › get html --lang=html | hl
```

The list of supported options and filters is available in wiki.

### REPL

```bash
 › keys * --repl
 js › var fs = require('fs');
 js › // `data` - redis result
 js ›
 js › data = data.map(/* do something */);
 js ›
 js › var content = JSON.stringify(data);
 js › fs.writeFileSync('./data.json', content);
```

## Node.js

The bare minimum for using `pretty-redis` on Node.js is requiring the module and create a `PrettyRedis` instance and calling `#exec(command)` to execute a command:

```javascript
var PrettyRedis = require('pretty-redis');
var client = new PrettyRedis(); // connect to localhost:6379

client.exec('keys *')
  .then(function (ctx) {
    // success
  }, function (err) {
    // field
  });
```

### Use plugins

[plugins](./lib/plugins/index.js).

```javascript
var plugins = PrettyRedis.plugins;

client.use(plugins.keys());
client.use(plugins.jsonPrettify());
// and so on
```

### Custom filter

```javascript
client.use(function (next) {
  if (!this.hasFilter('my-custom-filter')) {
    return next();
  }
  // do something here
  next();
});
```

## License

(The MIT License)
