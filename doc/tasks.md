## demo system (UIUE)

- [x] Header => 一个工具名称 (title) + 底下一个简单的介绍和wifi接入的提示 (说明信息)
- [x] 把那个破链的图片去掉
- [x] 入口链接后面加入 ("在新窗口打开") 的另一个链接
    - [x] 这个新链接平时用 opacity:0.1 展示, 鼠标hover到改入口记录时, 改为 opacity: 0.8 
        - 或根据实际情况调整
    - [x] 点击在新窗口打开改页面 (注意, 不再是用iframe的形式)
- [x] demo 发送请求的改进
    - [x] config.shouldSendDemo 的配置项使用, 注意默认值为 true, 即在undefined的情况下, 为true使用
    - [x] 注意一个问题, 就是未来可能多个人在同一个项目下开发, 所以考虑有 demoFrom 一项设置


## proposed config

- 参见 @[  Bird config example  ]{t97zs_2osppcsk_iom9suor}@
- [x] auth plugin specified
- [x] middle ware setting
- [x] router setting
- [x] 暂时取消 array 的设定??
    - 推荐 bird 内置于项目中, 作为代码的一部分跟着项目走
    
    
## 实现配置文件的动态加载 (当前需要重新启动服务器)

- [x] 当检测到 bird config 有更新, 不用重启server地刷新config
    - 参见 @[  动态更新 config 对象  ]{t97zs_zd0tksdx_iom9u7yv}@
