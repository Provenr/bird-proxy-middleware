var birdConfig = {
    
    // 最基础的设置方案, 只需设置 静态文件 的根文件夹即可
    root: '../static-files',

    // 也可以用绝对路劲来定义这个静态文件夹
    // root: require('path').resolve(__dirname + '/../static-files'),

    // 如果 mockRoot 没有指定, 则会默认使用 root 作为mock的入口
    mockRoot: '../mock',
    
    routes: [
        // 所以, 如果有更细致的路由定义, 需要在模糊的定义之前定义, 否则永远都不会被执行到
        {test: '/static/hello$', static: '/test.js'},
        {test: '/static/', static: '/'},

        {test: '/static2/([^/]*)/', static: '/'},

        // 可以省略掉 .js, 注意, 你访问 /mock/hi/2 之类的路径, 也将触发 hi.js
        {test: '/mock/hi', mock: '/hi'}
    ]
}

module.exports = birdConfig