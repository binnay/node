const http = require("http");
const fs = require("fs");

/**
 * 三层嵌套
 * 回调过多
 */
// http.createServer(function(req, res) {
//     if (req.url === "/") {
//         fs.readFile("./database.json", function(err, data) {
//             if (err) {
//                 console.error(err);
//                 return res.end("Server Error");
//             }
//             const title = JSON.parse(data.toString());
//             fs.readFile("./template.html", function(err, data) {
//                 if (err) {
//                     console.error(err);
//                     return res.end("Server Error");
//                 }
//                 const temp1 = data.toString();
//                 const html = temp1.replace("%", title.join("</li><li>"));
//                 res.writeHead(200, { "Content-Type": "text/html" });
//                 res.end(html);
//             });
//         });
//     }
// }).listen(3003, "127.0.0.1");

http.createServer(function(req, res) {
    getSource(res);
}).listen(3003, "127.0.0.1");

function getSource(res) {
    fs.readFile("./database.json", function(err, data) {
        if (err) return handleError(err, res);
        getTemplate(JSON.parse(data.toString()), res);
    });
}

function getTemplate(source, res) {
    fs.readFile("./template.html", function(err, data) {
        // if (err) {
        //     return handleError(err, res);
        // }
        //这样会更短，为了短而不写努力ing。。。
        if (err) return handleError(err, res);
        formatHtml(source, data.toString(), res);
    });
}

function formatHtml(data, template, res) {
    const result = template.replace("%", data.join("</li><li>"));
    res.end(result);
}

function handleError(err, res) {
    console.log(err);
    res.end("服务器出错");
}
