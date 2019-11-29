var birdConfig = {
    
    name: 'platfomr-test',

    root: '../static-files',

    // 接口转发, 目前仅支持一个 server
    // useServer 指的是使用 config.servers 里哪一个设定作为 SERVER_INFO
    useServer: 'baidu',

    // servers 为所有我们感兴趣的server
    servers: {
        baidu: {
            server: 'http://www.baidu.com'
        }
    },

    routes: [
        {test: '/demo', static: '/demo'},
        {test: '/'}
    ],

    projectId: 'your projectId',
    platformUrl: 'http://origin.eux.bai' + 'du.com:8000/api/report',
    initCheckUrl: 'http://origin.eux.ba' + 'idu.com:8000/api/birdClientInit'
}

module.exports = birdConfig