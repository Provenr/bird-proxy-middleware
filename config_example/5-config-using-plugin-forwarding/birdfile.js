var birdConfig = {
    
    root: '../static-files',
    mockRoot: '../mock',

    // 接口转发, 目前仅支持一个 server
    // useServer 指的是使用 config.servers 里哪一个设定作为 SERVER_INFO
    useServer: 'baidu',

    // servers 为所有我们感兴趣的server
    servers: {
        baidu: {
            server: 'https://erp8030.baidu.com',

            // 使用 plugin, 可以指定一个插件, 自动取cookie
            // 使用 uuap2 作为 uuap 登陆模拟取cookie的插件
            plugin: 'uuap2',

            // 设定uuap使用的 user/password
            useUser: 'zhengliangliang',
            users: {
                zhengliangliang: 'zhengliangliang8030'
            }
        }
    },

    routes: [
        {test: '/static/hello$', static: '/test.js'},
        {test: '/static/', static: '/'},

        {test: '/static2/([^/]*)/', static: '/'},

        {test: '/mock/hi', mock: '/hi'},

        // 获得 erp8030 里的 user context 接口返回的数据
        {test: '/bprouting/rest/api/user/context'}
    ]
}

module.exports = birdConfig