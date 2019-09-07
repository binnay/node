const http = require("http");
const fs = require("fs");
const mime = require("mime");
const path = require("path");
const chatServer = require("./lib/chat_server.js");
const cache = {};

/**
 * 404
 * @param response
 */
function send404(response) {
    response.writeHead(404, { "Content-Type": "text/plain" });
    response.write("Error 404: resource not found");
    response.end();
}

/**
 * 响应文件到浏览器
 * @param response
 * @param filePath
 * @param fileContents
 */
function sendFile(response, filePath, fileContents) {
    response.writeHead(200, {
        "Content-Type": mime.getType(path.basename(filePath))
    });
    response.end(fileContents);
}

/**
 * 请求文件是否存在,跳转,缓存
 * @param response
 * @param cache
 * @param abspath
 */
function serverStatic(response, cache, abspath) {
    if (cache[abspath]) {
        sendFile(response, abspath, cache[abspath]);
    } else {
        fs.exists(abspath, function(exists) {
            if (exists) {
                // 同步读取， data是完整数据
                fs.readFile(abspath, function(err, data) {
                    if (err) {
                        send404(response);
                    } else {
                        cache[abspath] = data;
                        sendFile(response, abspath, data);
                    }
                });
            } else {
                send404(response);
            }
        });
    }
}

const server = http
    .createServer(function(request, response) {
        let filePath = false;
        if (request.url === "/") {
            filePath = path.join("public", "index.html");
        } else {
            filePath = path.join("public", request.url);
        }
        serverStatic(response, cache, filePath);
    })
    .listen(3003, function() {
        console.log("http run at http://localhost:3003");
    });

chatServer.listen(server);
