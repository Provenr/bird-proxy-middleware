
try {
    var bird = require('bird-proxy-middleware')
} catch (ex) {
    // 这个 catch 分支只为开发bird-proxy-middleware时使用
    bird = require('../index')
}

// 测试时, 记得把 config 里的 middleware 设置为 false
bird('./birdfile_example.js')
