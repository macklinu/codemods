import requireJsToCommonJs from '../requirejs-to-commonjs'
import { jscodeshiftTester } from './helpers'

jscodeshiftTester({
  module: requireJsToCommonJs,
  tests: {
    'ignores code without define()': 'var a; var b; document.hasFocus();',
    'replaces define with module.exports': `
    define(function(require) {
      var a = require('a')
      var b = require('b')

      return b.doSomethingWith(a)
    })`,
    'replaces arrow-function define with module.exports': `
    define(require => {
      var a = require('a')
      var b = require('b')

      return b.doSomethingWith(a)
    })`,
    'replaces object with module.exports': `
    define({
      a: 1,
      b: 2,
      c: 3,
    })
    `,
    'replaces function that returns object with module.exports': `
    define(() => ({
      RESOLVED: "RESOLVED",
      IGNORED: "IGNORED",
      UNRESOLVED: "UNRESOLVED"
    }));
    `,
    'ignores define with no arguments': `define()`,
    'ignores non-global define': `
    function something() {
      return define({ a: 1 })
    }
    `,
    'handles define with two arguments': `
    define(['jQuery', 'backbone', 'underscore'], function($, Backbone, _) {
      var CONSTANT = 'a'

      function somefn() {}

      return Backbone.View.extend({})
    })
    `,
    'handles arrow function callback': `
    define(['jQuery', 'backbone', 'underscore'], ($, Backbone, _) => {
      var CONSTANT = 'a'

      function somefn() {}

      return Backbone.View.extend({})
    })
    `,
    'handles require param in array of modules': `
    define(['require', 'backbone', 'underscore'], function(require, Backbone, _) {
      const someOtherModule = require('some/other/module')

      return Backbone.View.extend(_.extend({}))
    })
    `,
  },
})
