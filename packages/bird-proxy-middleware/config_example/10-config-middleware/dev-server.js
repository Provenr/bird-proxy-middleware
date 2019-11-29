try {
    var bird = require('bird-proxy-middleware')
} catch (ex) {
    // 这个 catch 分支只为开发bird-proxy-middleware时使用
    // 在实际开发中, 请直接使用 `var bird = require('bird-proxy-middleware')` 即可
    bird = require('../../index')
}



var express = require('express')

var app = express()

// 测试时, 记得把 config 里的 middleware 设置为 true
// 或者使用 app.use(bird('./birdfile'))
app.all('*', bird('./birdfile'))

app.listen(3456, function() {
    console.log('dev server at http://localhost:3456')
})
