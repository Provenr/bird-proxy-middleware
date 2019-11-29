var birdConfig = {
    
    root: '../static-files',
    mockRoot: '../mock',

    // 接口转发, 目前仅支持一个 server
    // useServer 指的是使用 config.servers 里哪一个设定作为 SERVER_INFO
    useServer: 'baidu',

    // servers 为所有我们感兴趣的server
    servers: {
        baidu: {
            server: 'http://demo.neisou.baidu.com',

            // 使用 plugin, 可以指定一个插件, 自动取cookie
            // 使用 uuap2 作为 uuap 登陆模拟取cookie的插件
            plugin: 'uuap2',

            // 设定uuap使用的 user/password
            useUser: 'zhengliangliang',
            users: {
                zhengliangliang: 'zhengliangliang'
            },

            // 如果目标的登陆页面/服务的路径与 server 设置的根url 不一致, 可以在这里单独设置
            // 你可以把这一行代码注释掉看实际效果
            loginUrl: 'http://demo.neisou.baidu.com/web'
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