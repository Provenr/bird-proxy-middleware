var birdConfig = {
    
    root: '../static-files',
    mockRoot: '../mock',

    // 接口转发, 目前仅支持一个 server
    // useServer 指的是使用 config.servers 里哪一个设定作为 SERVER_INFO
    useServer: 'baidu',

    // servers 为所有我们感兴趣的server
    servers: {
        baidu: {
            server: 'https://www.baidu.com'
        }
    },

    routes: [
        {test: '/static/hello$', static: '/test.js'},
        {test: '/static/', static: '/'},

        {test: '/static2/([^/]*)/', static: '/'},

        {test: '/mock/hi', mock: '/hi'},

        // 全站接口转发
        {test: '/'}
    ]
}

module.exports = birdConfig