pretty-redis
------------

A simple and beautiful cli client for redis.

```bash
$ npm i -g pretty-redis
```
[![MPM](https://nodei.co/npm/pretty-redis.png?downloads=true&stars=true)](http://npmjs.org/pretty-redis)

![screencast](https://raw.githubusercontent.com/poying/pretty-redis/master/screencast.gif)

## Example

```bash
 › set xml:test:1 '<?xml version="1.0"?><feed></feed>'

   OK

 › get xml:test:1

   <?xml version="1.0"?><feed></feed>

 › get xml:test:1 --lang=xml

   (html)

   <?xml version="1.0" ?>
   <feed></feed>

 › get xml:test:1 --lang=xml | highlight

   (html)

   <?xml version="1.0" ?>
   <feed></feed>
```

## Options

* `--type`
  * alias: `--lang`

## Filters

* `highlight`
  * alias: `hicat`, `hl`

## License

(The MIT License)
