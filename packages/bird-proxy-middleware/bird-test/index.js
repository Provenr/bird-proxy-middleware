var npath = require('path')
var bird = require('bird-proxy-middleware')

var utils = {
    p: function (path) {
        return npath.resolve(path);
    }
}

var birdFilePath = utils.p('./bird/birdfile.js')
bird(birdFilePath)
