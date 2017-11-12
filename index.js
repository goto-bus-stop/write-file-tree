var assert = require('assert')
var path = require('path')
var fs = require('fs')
var mapLimit = require('map-limit')
var isPlainObject = require('is-plain-object')

module.exports = function writeFileTree (basedir, tree, opts, cb) {
  if (typeof opts === 'function') {
    cb = opts
    opts = {}
  }

  assert.equal(typeof basedir, 'string', 'write-file-tree: basedir must be string')
  assert.equal(typeof tree, 'object', 'write-file-tree: tree must be object')
  assert.equal(typeof opts, 'object', 'write-file-tree: opts must be object')
  assert.equal(typeof cb, 'function', 'write-file-tree: callback must be function')

  var limit = opts.limit != null ? opts.limit : 5
  assert.equal(typeof limit, 'number', 'write-file-tree: opts.limit must be a number')

  write(basedir, tree, cb)

  function write (basedir, tree, cb) {
    var queue = []
    fs.mkdir(basedir, ondir)
    function ondir (err) {
      if (err && !/EEXIST/.test(err.message)) return cb(err)
      var files = Object.keys(tree)
      mapLimit(files, limit, writeNode, ondone)
    }
    function writeNode (filename, next) {
      var fullname = path.join(basedir, filename)
      if (isPlainObject(tree[filename])) {
        queue.push(write.bind(null, fullname, tree[filename]))
        next()
      } else {
        fs.writeFile(fullname, tree[filename], { encoding: opts.encoding }, next)
      }
    }
    function ondone (err) {
      if (err) {
        cb(err)
      } else if (queue.length) {
        queue.shift()(ondone)
      } else {
        cb(null)
      }
    }
  }
}

module.exports.sync = function writeFileTreeSync (basedir, tree, opts) {
  opts = opts || {}

  assert.equal(typeof basedir, 'string', 'write-file-tree: basedir must be string')
  assert.equal(typeof tree, 'object', 'write-file-tree: tree must be object')
  assert.equal(typeof opts, 'object', 'write-file-tree: opts must be object')

  return writeSync(basedir, tree)

  function writeSync (basedir, tree) {
    try {
      fs.mkdirSync(basedir)
    } catch (err) {
      if (!/EEXIST/.test(err.message)) {
        throw err
      }
    }
    var files = Object.keys(tree)
    for (var i = 0; i < files.length; i++) {
      var filename = files[i]
      var fullname = path.join(basedir, filename)
      if (isPlainObject(tree[filename])) {
        writeSync(fullname, tree[filename])
      } else {
        fs.writeFileSync(fullname, tree[filename], { encoding: opts.encoding })
      }
    }
  }
}
