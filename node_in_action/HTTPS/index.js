/**
 * 假装把证书放在了.ssh文件里
 * key.pem放在项目文件里就可以
 */

const https = require("https");
const fs = require("fs");

const options = {
    key: fs.readFileSync("./key.pem"),
    cert: fs.readFileSync("./.ssh/key-cert.pem")
};

https
    .createServer(options, function(req, res) {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end("HELLO TEST HTTPS");
    })
    .listen(3003);
