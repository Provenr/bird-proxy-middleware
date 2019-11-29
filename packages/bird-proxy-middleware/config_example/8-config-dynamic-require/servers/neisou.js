module.exports = {
    server: 'http://demo.neisou.baidu.com',

    plugin: 'uuap2',

    useUser: 'zhengliangliang',
    users: {
        zhengliangliang: 'zhengliangliang'
    },

    loginUrl: 'http://demo.neisou.baidu.com/web',

    // 如果更改这个 reloginSeq, bird 会刷新缓存的cookie信息, 重新做登陆
    // 这种配置, 在很多开发的场景中非常有用
    reloginSeq: 1
}