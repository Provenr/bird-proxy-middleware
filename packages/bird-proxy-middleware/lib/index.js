var express = require('express')
var fs = require('fs')
var npath = require('path')
var fork = require('child_process').fork;

var request = require('request')
var colors = require('colors');

var utils = require('common/utils')
var birdUtils = require('bird-common/utils')
var configParser = require('bird-common/config-parser')

var proxy = require('bird-lib/proxy')
var demoServerSender = require('bird-lib/demo-server-sender')
var sp = require('common/sp')

var initFromPlatform = require('./legacy/lib/init-from-platform');
var middleTasksManager;
var originBirdfilePath;

/**
 * bird启动入口
 *
 * 这两个参数
 *
 * @param birdfileFolder {String}   bird file 的 folder 路径, 这个不作为暴露到外界的参数
 *                                  请参照 ../index.js 里的 `.bind()`
 * @param birdfilePath {String}     bird file 的路径, 可以是绝对路径, 也可以是相对路径
 *                                  相对路径以 '.' 开头
 *
 * @return {undefined}
 */
function start(birdfileFolder, birdfilePath) {

    if (typeof birdfilePath != 'string') {

        birdUtils.logs(
            ['error', 'You should pass in a path to the config file, instead of passing in the config object'],
            ['hint', 'A new config file is created based on the config object you passed in'],
            ['hint', 'You can simply replace the path of the new config file in your `bird( "./birdfile_config.js" )` function call'],
            ['hint', 'NOTE that the config file name may vary according to how you name your config file']
        )

        var birdfileName = 'birdfile_config.js'
        var birdfileExampleName = 'birdfile_config_example.js'

        if (!fs.existsSync(birdfileName)) {
            fs.writeFileSync(birdfileName, 'module.exports = ' + JSON.stringify(birdfilePath, null, 4))
            fs.writeFileSync(birdfileExampleName, fs.readFileSync(utils.p(__dirname + '/../config_example/birdfile_example.js')).toString())
        }

        return;
    } else {
        if (birdfilePath.substr(0, 1) == '.') {
            birdfilePath = utils.p(birdfileFolder + '/' + birdfilePath)
        } else {
            birdfilePath = utils.p(birdfilePath)
        }

        if (!/\.js$/.exec(birdfilePath)) {
            birdfilePath += '.js'
        }
    }

    var config = configParser.parse(birdfilePath);

    if (!config.name) {
        config.name = 'Untitled App'
    }

    /*
     注意: 以下逻辑会被改成默认情况下会产生 bird_config/ 文件夹

     <<[ 改进 preset 为 自动产生 bird_config/ ]{c2i4y_ax2uuieo_ip97t7vn}>>
     */
    if (config.presetGitUrl) {
        var configDirname = npath.dirname(birdfilePath)
        var presetPath = npath.resolve(configDirname + '/presets')

        if (!fs.existsSync(presetPath)) {
            // 如果设置了 presetGitUrl, 那么我们就欢乐的把 preset的东西download下来, 放置于 config 的同级
            sp('git clone ' + config.presetGitUrl + ' presets ', {
                cwd: npath.dirname(birdfilePath)
            })
                .catch(function (error) {
                    birdUtils.logs(
                        ['error', 'Failed to fetch the preset git repo, please check if your git repo is reachable or you have set a correct git repo url?'],
                        ['error', error]
                    )
                })
                .then(function () {
                    birdUtils.logs(
                        ['info', 'Git repo for server preset has been cloned as : ' + npath.dirname(birdfilePath) + '/preset'],
                        ['hint', 'You can set a preset on the server config by requiring some of the preset config in your bird config file'],
                        ['hint', 'Please manually pull from origin to update the preset repo']
                    )

                    utils.ensureGitignore(configDirname + '/.gitignore', [
                        '/presets'
                    ])
                })
        } else {
            // <<[ 打印log信息 ]{c2i4y_u93fy4z5_ip97o7xz}>>
            birdUtils.logs(
                ['info', 'Preset git repo has been cloned, skipped cloning'],
                ['hint', 'You can set a preset on the server config by requiring some of the preset config in your bird config file'],
                ['hint', 'Please manually pull from origin to update the preset repo'],
                []
            )
        }
    } else {
        birdUtils.logs(
            ['info', 'Preset git repo is not set, so nothing will be cloned.'],
            ['hint', 'You may want to set a presetGitUrl in your bird config for cloning the preset server settings for dev, e.g. https://github.com/AngusYang9/bird-proxy-middleware-configs.git'],
            []
        )
    }

    // demoServerSender(config);

    // config 检测过程
    if (!config) {
        birdUtils.log('error', 'Config should not be empty, please check your config file.')
        return;
    }

    if (!config.staticFileRootDirPath) {
        var missingParts = []
        if (!config.root) {
            missingParts.push('root')
        }

        birdUtils.logs(
            ['error', 'The following required setting is missing: ' + missingParts.join(', ')],
            ['error', 'Please check your configuration'],
            ['hint', 'You can refer to the bird README.md or birdfile_example.js to get more information']
        )
        return;
    }

    /*
     *  如果配置了weinre服务，则启动
     */
    var weinreConfig = config.weinre;
    if (weinreConfig && weinreConfig.open) {
        var weinre = require('weinre');
        var weinrePort = weinreConfig.port || 8080;
        weinre.run({
            httpPort: weinrePort,
            boundHost: birdUtils.getIP(),
            verbose: false,
            debug: false,
            readTimeout: 5,
            deathTimeout: 15
        });
        birdUtils.logs(
            ['hint', 'Please visit http://'+ birdUtils.getIP() +':' + weinrePort +' to check your weinre page']
        );
    }

    // 从指定server拉取bird的初始化配置信息
    if (config.initCheckUrl /*&& !config.middleware*/) {
        initFromPlatform(config, birdfileFolder).then(function (data) {
            // config = data;
            restart(config);
        }).catch(function (data) {
            // config = data;
            runServer();
        });
        if (config.middleware) {
            return proxy(config)
        }
    }
    else {
        return runServer();
    }

    /**
     * 集中处理所有请求
     */
    function runServer() {
        if (!config.middleware) {
            var app = new express()

            app.all('*', proxy(config))

            // go!
            app.listen(config.birdPort)
            console.info('BIRD'.rainbow, '============', config.name, 'RUNNING at', 'http://localhost:' + config.birdPort, '===============', 'BIRD'.rainbow);
        } else {
            console.info('BIRD'.rainbow, '============', config.name, 'RUNNING as middleware', '===============', 'BIRD'.rainbow);
            return proxy(config)
        }
    }

};

/**
 * @method restart
 *
 * @param {Object} config 配置信息
 *
 * @description: 更新npm包之后在本进程执行目录下重启bird
 */
function restart(config) {
    try {
        var child = fork(__filename, ['-cps'],
            {
                cwd: process.cwd(),
                silent: false
            }
        );
    }
    catch(e) {
        console.info(e);
    }
    child.send({
        command: 'startup',
        config: config,
        args: [birdfileFolder, originBirdfilePath]
    });
    process.on('exit', function (code) {
        child.kill();
    });
}

// 当作为子线程启动的入口
if (process.argv[3] === '-cps') {
    process.on('message', function (data) {
        if (data.command === 'startup') {
            start(data.args[0], data.args[1]);
        }
    });
}

module.exports = function (birdfileFolder, birdfilePath) {
    originBirdfilePath = birdfilePath;
    if (!!process.argv[3] || process.argv[3] !== '-cps') {
        return start(birdfileFolder, birdfilePath);
    }
};
