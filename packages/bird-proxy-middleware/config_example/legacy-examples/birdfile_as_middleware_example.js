var npath = require('path')

module.exports = {
    // bird 的名称, 该名称也会作为 demo server 的一个信息传过去
    name: 'Baidu.com test dev server',

    // bird 启动的 port, 如果设置成 middle ware的话, 将失效
    // 注意: 这个设置无法进行动态更改
    port: 7680,

    // middleware 的话, bird会return一个中间件函数, 默认为false
    // 注意: 这个设置无法进行动态更改
    // middleware: false,
    middleware: true,

    // 默认的 静态资源 rootC
    root: npath.resolve(__dirname),

    // 目标后端, 默认为不设置
    useServer: 'serverA',

    // 所有预设的 servers
    servers: {
        serverA: {
            // only for test: http://localhost:7679/bpTaskService/query/queryTaskList
            server: 'https://erp8020.baidu.com/',

            // 用于forward前处理的plugin
            // bird 预设的 plugin, 通常为auth所用 通过 string 来给定
            plugin: 'uuap',

            // @todo, 需要讨论是否需要, 后续进行开发
            // 你也可以通过指定一些列的plugins来顺序对forward前的reqForward或urlOptions进行改造
            // plugins: [function, 'uuap', ...]


            // server : 为当前 server Object
            // reqForward : 为当前要 forward 的 req, plugin需要根据给定的 server info 对 urlOptions 进行更新
            // plugin 允许用户自己定义和加载
            // plugin: function(isRetry, serverConfig, urlOptions) { ... },

            // some-auth-method.js 为符合 auth plugin 函数原型的一个npm module脚本, 即:
            // 返回: module.exports = function (isRetry, serverConfig, urlOptions) { ... }
            // plugin: require('./some-auth-method.js'),


            // 一些自定义的 settings, e.g.
            useUser: 'jingqi',

            // 格式为 username : password
            users: {
                'chenchengxing': 'chenchengxing120',
                'jingqi': 'jingqi120'
            },

            bprouting: 'bprouting/BpSecurityAuthentification?bpservice=https%3A%2F%2Ferp8020.baidu.com%2Fbprouting%2FBpFlowRouting%3Fappindex%3Dtrue%26t%3D0.9769457862712443',
            uuapServer: 'http://bjkjy-ite-uuapforerp01.bjkjy.baidu.com:8020/',

            // 如果发现被 30X, 401, 403 等, 则说明我们需要重新尝试, 默认尝试一次
            // 例如, 长时间没有操作, 导致登陆session过期, cookie失效, 这时, 需要重新登陆
            // 默认为false
            retry: true,

            // 也允许用户加入特定的 retry 检测方法来判定cookie是否失效需要重新登陆获取
            retryMethod: 'return201',

            // retryMethod 也可以根据特定的项目设置为一个方法, 例如一下函数, 是利用 302 返回来判定是否要retry
            // retryMethod: function( statuseCode, rawBody ) {
            //      return statusCode == '302'
            // }
        },
        serverB: {
            server: 'http://demo.neisou.baidu.com/',

            // 如果没有给定任何的auth plugin, 则用默认的 default,
            // default 主要就是把cookie写到头部去
            cookie: 'JSESSIONID=643E5292B1676E6B33E1F5D0E03C0E9; BAIDUID=031B6952E6FF806896123228E25559203:FG=1; PSTM=1452954331; BIDUPSID=4C51BF818FDFWE385B6623C0C84E16F348E; '
        },
        serverC: {
            server: 'https://www.baidu.com',
            //server: 'http://demo.neisou.baidu.com/',
            //server: 'https://www.teambition.com',

            // 如果没有给定任何的auth plugin, 则用默认的 default,
            // default 主要就是把cookie写到头部去
            cookie: 'JSESSIONID=D0D9B07C9B8466F496122C73737618C0; '
        }
    },

    // 需要一个完整路径, 如果没有设置, 或者是设置为空, 则root会默认作为mock的root
    mockRoot: false,

    // 默认的文件夹入口, 即如果访问的是文件夹, 且本设置为非空, 则尝试返回该文件夹下的同名文件
    // 默认为 index.html
    defaultIndex: 'index.html',

    // routes 使用顺序单次匹配, 如果某一次匹配成功, 则不做下一次fallback匹配, 用于简单化整个数据转接的流程, 避免路由过于复杂, 调试繁琐
    routes: [
        // 匹配从root开始的url, 允许正则, 默认都是从起始开始匹配, 例如, '/api/' => /^\/api\//
        // 两种类型: 'mock' 和 'static'

        // mock: 从mockRoot开始计算
        /*
         如果 mock 文件返回一个函数, 那么将运行这个函数, 并返回 mock data
         函数原型: function(urlInfo, queryObject, postBody)
         */
        {test: '/api/some-data.json', mock: 'mock/hi2'},
        {test: '/api/some-other-data.json', mock: 'mock/hi'},

        // 如果没有指定 mock 或 static, 则理解为接口转发, 将走指定的后端 server, 如果没有指定 replace, 则不进行replace
        {test: '(/api/)to/(data.json)', replace: '$1$2'},
        {test: '/api/'},
        {test: '/root', static: '/'},
        {test: '/bpTaskService'},

        // static: 是匹配至静态资源
        {test: '/root/', static: '/'},
        {test: '/', static: '/'}
    ],


    // 待定 (未开发), 如果有开发出webUI, 可以考虑允许用户指定webUI的context
    birdWebUI: '/biiiirrrrd/',

    // 是否打印出debug信息
    debug: true,

    // @todo <<[ 给其他人看的 demo ]{c2i4y_gbr60jmp_iomwah1i}>>
    /*
     这个功能, 主要是为了改良我们的开发流程:

     现有的流程是, FE同学开发了很久之后, 推测上线, 然后再在线上环境给U同学和PM, RD看.
     这个流程相当漫长, 以至于看了demo之后, 要改东西十分仓促, 或是会产生无谓的额外工作.

     事实上, 由于使用bird开发, 我们本地也相当于起了一个台server, 只要知道ip, 就可以很方便让其他人访问
     但是, 获取ip, 生成连接, 发给别人是一个很繁琐的流程,

     所以, 我们尝试使用bird自动管理这些连接的方法:

     1. 启动一个大家能访问的server
     2. 某个开发人员, 如果打开bird进行开发的话, 那么, 这个bird隔一段时间, 会发送一个请求给server,
     a. 请求带的数据, 包括一些常用的页面的path (以及简单解释)
     3. server 得到这些请求, 会记住这些信息,
     4. server 提供一个链接列表的页面, 如果有人访问这个页面, server就会把当前 (一段时间内) 搜集的bird的信息
     生成一份连接列表展示出来, 只要点击, 就可以快速看到相应的demo

     */

    // 是否发送 demo 信息的更新连接, 默认为 true
    shouldSendDemo: true,

    // demo 服务器, 如果为空, 默认为 athena.eux.baidu.com:8301
    demoServer: 'athena.eux.baidu.com:8301',

    // demo 来自于谁...
    demoFrom: 'some one',

    // 所有当前的demo
    demos: {
        '/my-context/login.html': '登录页面',
        '/other-module/list.html': '查看所有item的页面'
    }
};