var birdConfig = {
    
    // 最基础的设置方案, 只需设置 静态文件 的根文件夹即可
    root: '../static-files',

    // 也可以用绝对路劲来定义这个静态文件夹
    // root: require('path').resolve(__dirname + '/../static-files'),

    /**
     * config.routes 是一个配置路由的基础,
     *
     * bird-proxy-middleware的路由机制是单次匹配
     * 即, 如果匹配到某一个路由规则的话, 就会停止再往下匹配 (哪怕用匹配中的规则去找资源, 出现404的情况)
     *
     * 每个路由的规则是:
     *
     * {
     *      test:       用字符串描述的正则表达式
     *      mock:       可选, 如果指定的话, 会在对应的 mockRoot 下找到 mock 文件
     *      static:     可选, 如果指定的话, 会在对应的 root 下找到对应的文件/文件夹
     *      如果 mock / static 都为空, 则会被视为为 "接口转发" 这个可以参照接口转发的例子
     * }
     */
    routes: [
        // 所以, 如果有更细致的路由定义, 需要在模糊的定义之前定义, 否则永远都不会被执行到
        {test: '/static/hello$', static: '/test.js'},
        {test: '/static/', static: '/'},

        {test: '/static2/([^/]*)/', static: '/'},
        {test: '/', static: '/'}
    ]
}

module.exports = birdConfig
