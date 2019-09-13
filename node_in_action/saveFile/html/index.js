/**
 * 代码任然可以优化
 * 比如程序初始化的时候，读取文件中的值，存入内容，以后就维持这个变量，不再读取文件
 * 文件的获取和读取可以不适用同步的方式，按照流程化的思路来构建html文件和json文件的读取适用
 * @type {module:http}
 */
const http = require("http");
const fs = require("fs");
const qs = require("querystring");

const server = http.createServer(function(req, res) {
    console.log(req.method);
    switch (req.method) {
        case "GET":
            showPage(req, res);
            break;
        case "POST":
            getData(req, res);
            break;
        default:
            console.log("do nothing");
    }
});
server.listen(3003);

function showPage(req, res, task) {
    let chunk = "";
    const stream = fs.createReadStream("./index.html");
    stream.on("data", function(data) {
        chunk += data;
    });
    stream.on("end", function() {
        res.setHeader("Content-Type", "text/html");
        // res.setHeader("Content-Length", chunk.length);
        const task = JSON.parse(fs.readFileSync("./.task.json").toString());
        const taskString = task
            .map(function(item, index) {
                return "<div>" + index + "、" + item + "</div>";
            })
            .join("");
        const result = chunk.toString().replace("%", taskString);
        res.end(result);
    });
    stream.on("error", function(err) {
        console.log(err);
    });
}

function getData(req, res) {
    const contentType = req.headers["content-type"];
    if (contentType.indexOf("application/x-www-form-urlencoded") !== -1) {
        req.setEncoding("utf8");
        let chunk = "";
        req.on("data", function(data) {
            chunk += data;
        });
        req.on("end", function() {
            const result = qs.parse(chunk);
            const taskJSON = fs.readFileSync("./.task.json");
            const taskResult = JSON.parse(taskJSON.toString());
            taskResult.push(result.item);
            fs.writeFileSync("./.task.json", JSON.stringify(taskResult));
            showPage(req, res, taskResult);
        });
    } else {
        res.end("Please done use multipart/form-data");
    }
}
