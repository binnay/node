const http = require("http");
const fs = require("fs");
/**
 * 链式调用
 */
// http.createServer(function (req, res) {
//     res.writeHead(200, {'Content-Type': 'text/plain'});
//     res.end('Hello World\n');
// }).listen(3003);
/**
 * EventEmitter事件调用
 */
// const server = http.createServer();
// server.on('request', function(req, res){
//     res.writeHead(200, {'Content-Type': 'text/plain'});
//     res.end('Hello World2');
// });
// server.listen('3003');
/**
 * fs读取文件
 */
// const stream = fs.createReadStream('./test.json');
// let result = "";
// stream.on('data', function(chunk){
//     result += chunk;
// });
// stream.on('end', function(){
//     console.log('finished');
//     console.log(JSON.parse(result))
// });
/**
 * pip管道流
 */
http
  .createServer(function(req, res) {
    res.writeHead(200, { "Content-Type": "image/jpeg" });
    fs.createReadStream("./landscape-4401120.jpg").pipe(res);
  })
  .listen(3003);
console.log("http run at http://localhost:3003");
