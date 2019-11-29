try {
    // var bird = require('bird-proxy-middleware');
    bird = require('../../index');
} catch (ex) {
    // 这个 catch 分支只为开发bird-proxy-middleware时使用
    // 在实际开发中, 请直接使用 `var bird = require('bird-proxy-middleware')` 即可
    bird = require('../../index');
}

bird('./birdfile');
