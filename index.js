// console.log('@debug, module = ', module)

var npath = require('path')
module.exports = require('./lib/index.js').bind(null, npath.dirname(module.parent.filename))
