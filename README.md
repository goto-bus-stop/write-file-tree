# write-file-tree

write an object to nested file tree, with one file for each value

[![npm][npm-image]][npm-url]
[![travis][travis-image]][travis-url]
[![standard][standard-image]][standard-url]

[npm-image]: https://img.shields.io/npm/v/write-file-tree.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/write-file-tree
[travis-image]: https://img.shields.io/travis/goto-bus-stop/write-file-tree.svg?style=flat-square
[travis-url]: https://travis-ci.org/goto-bus-stop/write-file-tree
[standard-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square
[standard-url]: http://npm.im/standard

## Install

```
npm install write-file-tree
```

## Usage

```js
var writeFileTree = require('write-file-tree')

writeFileTree('/path/to/directory', {
  'index.html': '<!DOCTYPE html><html>...',
  'bundle.js': getMyBundle()
}, function (err) {
  if (err) console.error('failed')
})
```

## API

### `writeFileTree(basedir, tree[, opts], cb)`

Recursively write each value in the `tree` object to a directory `basedir`.
`opts` can be an object:

 - `opts.encoding` - encoding to pass to [`fs.writeFile()`](https://nodejs.org/api/fs.html#fs_fs_writefile_file_data_options_callback)
 - `opts.limit` - max amount of i/o operations to run simultaneously. default 5.

`cb` is a node-style callback receiving an `error` in the first parameter.
Object keys in the `tree` object are file names, while values are the file contents. Nested directories have another `tree` object as their value.
For example, the [test/fixture](./test/fixture) directory can be written by using this object:

```js
writeFileTree('test/fixture', {
  'one.js': '1;\n',
  'two.js': '2;\n',
  a: {
    b: {
      'c.txt': 'this is c\n',
      c: {
        'd.txt': 'file d\n' } } }
}, cb)
```

### `writeFileTree.sync(basedir, tree[, opts])`

The same, but sync.

## See Also

 * [read-file-tree](https://github.com/goto-bus-stop/read-file-tree) - recursively read contents of all files in a directory

## License

[Apache-2.0](LICENSE.md)
