var birdConfig = {
    
    root: '../static-files',
    mockRoot: '../mock',

    useServer: 'erp8030',
    servers: {

        // 有些时候, 我们在一个大的团队里做协作, 而 birdfile 由于会被作为本地的配置文件被忽略掉,
        // 我们需要有一些公共的部分可以作为大家都可以很方便引用的设置
        // 同时, 我们也需要能够在这些公共文件被修改的时候, 也能动态刷新bird的总体配置,
        // 所以, 可以使用 birdDynamicRequire 来代替 原生的 nodejs 的 require
        neisou: birdDynamicRequire('./servers/neisou'),
        erp8030: birdDynamicRequire('./servers/erp8030') 
    },

    routes: [].concat(
        birdDynamicRequire('./routes/statics'),
        birdDynamicRequire('./routes/neisou-routes'),
        birdDynamicRequire('./routes/erp8030-routes')
    )
}
 
module.exports = birdConfig