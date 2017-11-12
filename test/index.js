var test = require('tape')
var writeFileTree = require('../')
var readFileTree = require('read-file-tree')
var tmpdir = require('tempy').directory

var data = {
  'one.js': '1;\n',
  'two.js': '2;\n',
  a: {
    b: {
      'c.txt': 'this is c\n',
      c: {
        'd.txt': 'file d\n'
      }
    }
  }
}

test('writeFileTree', function (t) {
  t.plan(1)

  var dir = tmpdir()
  writeFileTree(dir, data, ondone)

  function ondone () {
    t.deepEqual(readFileTree.sync(dir, { encoding: 'utf8' }), data)
  }
})

test('sync', function (t) {
  t.plan(1)

  var dir = tmpdir()
  writeFileTree.sync(dir, data)
  t.deepEqual(readFileTree.sync(dir, { encoding: 'utf8' }), data)
})
