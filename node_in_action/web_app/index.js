const http = require("http");
const url = require("url");
const items = [];

const server = http.createServer(function(req, res) {
    switch (req.method) {
        case "POST":
            let item = "";
            req.setEncoding("utf8");
            req.on("data", function(chunk) {
                item += chunk;
            });
            req.on("end", function() {
                console.log(item);
                items.push(item);
                console.log(items);
                res.end("OK\n");
            });
            break;
        case "GET":
            const result = items
                .map(function(item, i) {
                    return i + ")" + item;
                })
                .join("\n");
            res.setHeader("Content-Type", Buffer.byteLength(result));
            res.setHeader("Content-Type", 'text/plain; charset="utf-8');
            res.end();
            break;
        case "DELETE":
            console.log(req, url.parse(url));
            const path = url.parse(req.url).pathname;
            // 这里检验的不够，pathname可能不止一个，可能是/hello/1这样的格式，所以还可以细分
            const i = parseInt(path.slice(1), 10);
            const deleteIndex = judgeInputIndex(i, res);
            if (deleteIndex) res.end("Ok N");
            break;
        case "PUT":
            const pathname = url.parse(req.url).pathname;
            const pathnameArray = pathname.split("/"); // '/1/hi'.split('/') => ["", "1", "hi"]
            const putGetIndex = parseInt(pathnameArray[1]);
            const putGetValue = pathname[2];
            const putIndex = judgeInputIndex(putGetIndex, res);
            const putValue = judgeInputValue(value, res);
            if (putIndex && putValue) {
                items[putIndex] = putGetValue;
                res.end("Ok \n");
            }
            break;
        default:
            break;
    }
});

function judgeInputIndex(index, res) {
    if (isNaN(index)) {
        res.statusCode = 400;
        res.end("INVALID_VALUE");
    } else if (!items[index]) {
        res.statusCode = 404;
        res.end("Item not found");
    } else {
        return index;
    }
}
function judgeInputValue(value, res) {
    if (!value) {
        res.statusCode = 400;
        res.end("INVALID_VALUE");
    } else {
        return value;
    }
}

server.listen(3003);
