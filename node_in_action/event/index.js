/**
 * node index.js
 * telnet 127.0.0.1 3003
 */
// const net = require("net");
//
// const server = net.createServer(function(socket) {
//     socket.on("data", function(data) {
//         socket.write(data);
//     });
// });
// server.listen(3003);

/**
 * 事件暴露使用的小例子
 */
// const EventEmitter = require("events").EventEmitter;
// const channel = new EventEmitter();
// channel.on("join", function(obj) {
//     console.log(obj.name, obj.sex);
//     console.log("Welcome!");
// });
//
// channel.emit("join", {
//     name: "binna",
//     sex: "man"
// });

/**
 * 说是有有10个监听器的限制，好像并没有诶
 * @type {internal}
 */
// const event = require("events");
// const EventEmitter = event.EventEmitter;
//
// const myEvent = new EventEmitter();
//
// myEvent.on("1", function(res) {
//     console.log(res);
// });
// myEvent.on("2", function(res) {
//     console.log(res);
// });
// myEvent.on("3", function(res) {
//     console.log(res);
// });
// myEvent.on("4", function(res) {
//     console.log(res);
// });
// myEvent.on("5", function(res) {
//     console.log(res);
// });
// myEvent.on("6", function(res) {
//     console.log(res);
// });
// myEvent.on("7", function(res) {
//     console.log(res);
// });
// myEvent.on("8", function(res) {
//     console.log(res);
// });
// myEvent.on("9", function(res) {
//     console.log(res);
// });
// myEvent.on("10", function(res) {
//     console.log(res);
// });
// myEvent.on("11", function(res) {
//     console.log(res);
// });
//
// myEvent.emit("11", 1);
