<h3 align="center" style="margin: 30px 0 35px;">bird-proxy-middleware</h3>
<p align="center">
  <a href="https://www.npmjs.com/package/bird-proxy-middleware"><img alt="npm" src="https://img.shields.io/npm/v/bird-proxy-middleware"></a>
  <a href="https://raw.githubusercontent.com/AngusYang9/bird-proxy-middleware/master/LICENSE"><img alt="NPM" src="https://img.shields.io/npm/l/shell-spawn"></a>
</p>

---

##### bird-proxy-middleware 内置了具有 cas 认证的代理服务器，并可以轻松地实现mock数据以及静态资源

# 快速上手

## 安装

```shell
npm install --save bird-proxy-middleware
```

推荐在你的项目中创建一个 `bird/` 文件夹, 并下载配置模板:

```shell
mkdir bird
git clone git@github.com:AngusYang9/bird-proxy-middleware-configs.git bird
```

其中, birdfile.js 为你的 bird 配置文件。

## 作为中间件使用

**注意!! 最好把bird放置在所有其他的中间件或request handler后面**

```
var bird = require('bird-proxy-middleware')

...

// 假设 app 是一个 express 服务器对象
app.all('*', bird('./bird/birdfile.js'))

...
```

## birdfile 配置


```json
var birdConfig = {
  // 服务名称
  name: 'My App',
  // 服务端口，默认 8899
  port: 5678,
  // 静态文件目录
  staticFileRootDirPath: './static',
  // mock数据目录
  mockRoot: './mock',
  // 是否作为中间件使用，默认false，那么会自行启用express
  middleware: true,
  // 展示xhr数据，默认false
  //showXhrData: false,
  debug: true,
  // 应用的server
  useServer: 'devServer',
  // 多server列表
  servers: {
    devServer: devServer
  },
  // 路由
  routes: [],
}
```

## server 配置

```json
{
  // 目标 ip or domain
  server: 'http://10.0.0.0:8081',
  // 应用的auth插件，默认default，使用cookie
  plugin: 'default',
  // plugin为default时，使用的cookie
  cookie: 'your cookie here',
  // 应用的用户
  useUser: 'user1',
  // 多用户列表
  users: {
    user1: '123456',
    user2: '12345678',
  },
  // 修改保存后，会重新应用plugin认证登录
  reloginSeq: 0,
};
```

**如果你想为您的公司订制自动登录认证plugin，你可以联系我，告诉你项目的地址及登录帐号， 让我免费帮你加🤝**
