const http = require("http");
const parse = require("url").parse;
const join = require("path").join;
const fs = require("fs");

const root = __dirname;

const server = http.createServer(function(req, res) {
    const url = parse(req.url);
    console.log(root, "???");
    const path = join(root, url.pathname);
    const stream = fs.createReadStream(path);

    // stream.on("data", function(chunk) {
    //     res.write(chunk);
    // });
    // stream.on("end", function() {
    //     res.end();
    // });
    /**
     * 以上两个监听，等同下面的pipe
     */
    // stream.on("error", function(err) {
    //     console.log(err, "稳定性");
    // });
    // stream.pipe(res); //res.end()会在pipe的内部自动调用
    fs.stat(path, function(err, stat) {
        if (err) {
            if ("ENOENT" === err.code) {
                res.statusCode = 404;
                res.end("Not Found");
            } else {
                res.statusCode = 500;
                res.end("Internal Server Error");
            }
        } else {
            res.setHeader("Content-Length", stat.size);
            const stream = fs.createReadStream(path);
            stream.pipe(res);
            stream.on("error", function(err) {
                res.statusCode(500);
                res.end("Internal Server Error", err);
            });
        }
    });
});
server.listen(3003);
