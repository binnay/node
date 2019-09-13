const http = require("http");
const formidable = require("formidable");
const items = [];

http.createServer(function(req, res) {
    if ("/" === req.url) {
        switch (req.method) {
            case "GET":
                show(req, res);
                break;
            case "POST":
                console.log(req, "/////");
                upload(req, res);
                break;
            default:
                badRequest(res);
        }
    } else {
        notFound(res);
    }
}).listen(3003);

/**
 * multipart/form-data， 使用这个请求头，就代表表单中的数据会包含一些二进制文件，比如图片，文件等
 * @param req
 * @param res
 */
function show(req, res) {
    const html =
        "" +
        '<form method="post" action="/" enctype="multipart/form-data">' +
        '<p><input type="text" name="item" /></p>' +
        '<p><input type="file" name="item" /></p>' +
        '<p><input type="submit" value="Upload" /></p>' +
        "</form>";
    res.setHeader("Content-Type", "text/html");
    res.setHeader("Content-Length", Buffer.byteLength(html));
    res.end(html);
}

function notFound(res) {
    res.statusCode = 404;
    res.setHeader("Content-Type", "text/plain");
    res.end("Not Found");
}

function badRequest(res) {
    res.statusCode = 400;
    res.setHeader("Content-Type", "text/plain");
    res.end("Bad Request");
}

/**
 * 上传逻辑
 * @param req
 * @param res
 */
function upload(req, res) {
    if (!isFormData(req)) {
        res.statusCode = 400;
        return res.end("Bad Request: expecting multipart/form-data");
    }
    const form = new formidable.IncomingForm();
    /**
     * 以下三个可以合成一个
     */
    // form.parse(req);
    // form.on("field", function(field, value) {
    //     console.log(field, value);
    // });
    // form.on("file", function(name, file) {
    //     console.log(name, file);
    // });
    /**
     * 以上三个可以合成一个一个
     * 以下这个方法并不会在文件传输的时候，阻碍field内容的数据传输
     * 本质就是以上三个方法的API包装，换汤不换药
     */
    form.parse(req, function(err, fields, files) {
        if (err) return res.end("ERROR");
        console.log(files);
        console.log(files);
    });
    form.on("progress", function(bytesReceived, bytesExpected) {
        const percent = Math.floor((bytesReceived / bytesExpected) * 100);
        // 回传进度给浏览器， 需要套接字，需要改造html文件，实时接收上传进度（监听emit时间，先不做）
        console.log(percent);
    });
    form.on("end", function() {
        res.end("Upload complete");
    });
}

function isFormData(req) {
    const type = req.headers["content-type"] || "";
    return 0 === type.indexOf("multipart/form-data");
}
