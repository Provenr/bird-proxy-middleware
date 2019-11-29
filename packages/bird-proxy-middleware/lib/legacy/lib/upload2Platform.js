/**
 * @file: upload2PlatForm.js
 *
 * @author: swr
 *
 * @date: 2016-07-04 02:54:24
 *
 * @description: 在response关闭前上报数据到platform
 */
var config;
var http = require('http-debug').http;
var path = require('path');
var url = require('url');
var urlsHasReport = [];
var platformUrl;
var zlib = require('zlib')

/**
 * @method upload2PlantForm
 *
 * @param {Object} req 原始请求对象
 *
 * @param {Object} res http响应对象
 *
 * @param {Function} reslove Promise reslove
 *
 * @param {Function} reject Promise reject
 *
 * @description: 上传接口数据到plantform
 */
function upload2PlantForm(req, res, reslove, reject, chunk, reqChunk, server) {
    var result;
    var options = {
        host: platformUrl.hostname,
        port: platformUrl.port,
        path: platformUrl.path,
        headers: {},
        method: 'POST'
    };
    var IS_JSON = isJSONRequest(res._headers['content-type']);
    var responseJSON;
    delete options.headers['content-length'];
    options.headers['content-type'] =  'application/json;charset=UTF-8';

    if (!IS_JSON) {
        try {
            if (!contentEncodingContainsGzip(res._headers['content-encoding'])) {
                JSON.parse(chunk.toString('utf8'));
                IS_JSON = true;
            } else {
                // gzip type delays to later handling
            }
        }
        catch (e) {
            console.log(e)
        }
    }

    // 只上报JSON数据
    if (platformUrl.hostname && (IS_JSON || contentEncodingContainsGzip(res._headers['content-encoding'])) && !~urlsHasReport.indexOf(req.url)) {
        var request = http.request(options, function (res) {
            res.setEncoding('utf8');
            res.on('data', function (_chunk) {
                // console.info('BODY: ', _chunk.toString('utf8'));
            });
            res.on('end', function () {
                console.info('API ' + req.url + ' reported.');
                !config.debugUpload2Platform && urlsHasReport.push(req.url);
                reslove();
            });
            res.on('error', function (error) {
                // reject(error);
                console.info('report error', error);
                reslove(error);
            });
        });
        request.on('error', function (e) {
            // console.log(e)
        });
        // request.setHeader('x-data-url', path.join(config.server, req.url));
        result = createReqBody(
            config.projectId,
            // url.resolve(config.server, req.url),
            server,
            req.query // GET query
        );
        if (req.method === 'POST' && reqChunk) {
            var requsetJSON = reqChunk.toString();
            try {
                requsetJSON = JSON.parse(reqChunk.toString());
            }
            catch (e) {}
            requsetJSON && (result.requestData = requsetJSON);
        }

        var respStringToReport
        if (contentEncodingContainsGzip(res._headers['content-encoding'])) {
            zlib.gunzip(chunk, (err, buffer) => {
              if (!err) {
                // console.log(buffer.toString());
                respStringToReport = buffer.toString();
                procceedWithResponseString(request, result, JSON.parse(respStringToReport));
              } else {
                console.log(err)
              }
            });
        } else {
            try {
                respStringToReport = JSON.parse((chunk || new Buffer('{}')).toString(getEncode(res._headers['content-type'])));
            } catch (e) {
                // console.log('')
            }
            procceedWithResponseString(request, result, respStringToReport);
        }
    }
    else {
        reslove();
    }
}

function procceedWithResponseString (request, result, respStringToReport) {
    result.responseData = respStringToReport;
    // console.info('report data', JSON.stringify(result));
    request.write(JSON.stringify(result));
    request.end();
}

function contentEncodingContainsGzip (contenEncodingString) {
    if (!contenEncodingString) {
        return false
    }
    if (contenEncodingString.indexOf('gzip') === -1) {
        return false
    }
    return true
}
/**
 * @method getEncode
 *
 * @param {string} contentType header的content-type
 *
 * @return {string}
 *
 * @description: 根据header的content-type获取数据类型
 */
function getEncode(contentType) {
    var lcStr = (contentType || '').toLocaleLowerCase();
    if (~lcStr.indexOf('utf-8')) {
        return 'utf8';
    }
    else if (~lcStr.indexOf('gbk')) {
        return 'ucs2';
    }
    return 'utf8';
}

/**
 * @method isJSONRequest
 *
 * @param {string} contentType header的content-type
 *
 * @return {bool}
 *
 * @description: 根据header的content-type判断数据是否为JSON
 */
function isJSONRequest(contentType) {
    var lcStr = (contentType || '').toLocaleLowerCase();
    return lcStr.indexOf('application/json') > -1;
}

/**
 * @method createReqBody
 *
 * @param {string} name 项目对应的
 *
 * @param {string} path 数据的原始请求path
 *
 * @param {Object} reqData request的原始数据
 *
 * @param {Object} resData server的开发数据
 *
 * @return {Object}
 *
 * @description: 构建上报数据体
 */
function createReqBody(name, path, reqData, resData) {
    return {
        projectId: name,
        path: path,
        requestData: reqData,
        responseData: resData
    };
}


module.exports = function (_config, req, res, reslove, reject, chunk, reqChunk, server) {
    config = _config;
    platformUrl = url.parse(config.platformUrl || '');
    platformUrl.href && upload2PlantForm(req, res, reslove, reject, chunk, reqChunk, server);
};
