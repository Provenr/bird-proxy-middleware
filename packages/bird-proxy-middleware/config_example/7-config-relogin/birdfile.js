var birdConfig = {
    
    root: '../static-files',
    mockRoot: '../mock',

    useServer: 'baidu',
    servers: {
        baidu: {
            server: 'http://demo.neisou.baidu.com',

            plugin: 'uuap2',

            useUser: 'zhengliangliang',
            users: {
                zhengliangliang: 'zhengliangliang'
            },

            loginUrl: 'http://demo.neisou.baidu.com/web',

            // 如果更改这个 reloginSeq, bird 会刷新缓存的cookie信息, 重新做登陆
            // 这种配置, 在很多开发的场景中非常有用
            reloginSeq: 3
        }
    },

    routes: [
        {test: '/static/hello$', static: '/test.js'},
        {test: '/static/', static: '/'},

        {test: '/static2/([^/]*)/', static: '/'},

        {test: '/mock/hi', mock: '/hi'},

        // 内搜 demo 里的 suggest api
        {test: '/web/search/all/suggest'}
    ]
}

module.exports = birdConfig