const events = require("events");
const util = require("util");
const fs = require("fs");
const watchDir = "./watch";
const processedDir = "./done";

function Watcher(watchDir, processedDir) {
    this.watchDir = watchDir;
    this.processedDir = processedDir;
}

/**
 * inherits函数
 * 他是Node内置的util的模块里的
 * 用inherits函数继承另一个对象里的行为看起来很简洁
 */
util.inherits(Watcher, events.EventEmitter);

/**
 * 上面两句，等同于下面这一句
 * @type {module:events.internal.EventEmitter}
 */
// Watcher.prototype = new events.EventEmitter();

/**
 * 设置好Watcher对象后，还需要加两个新方法扩展继承自EventEmitter的方法
 * @type {module:events.internal.EventEmitter}
 */
Watcher.prototype.watch = function() {
    const watcher = this;
    fs.readdir(this.watchDir, function(err, files) {
        if (err) throw err;
        for (let index in files) {
            watcher.emit("process", files[index]);
        }
    });
};

Watcher.prototype.start = function() {
    const watcher = this;
    fs.watchFile(watchDir, function() {
        watcher.watch();
    });
};

const watcher = new Watcher(watchDir, processedDir);

watcher.on("process", function(files) {
    const watchFile = this.watchDir + "/" + files;
    const processedFile = this.processedDir + "/" + files.toLowerCase();
    console.log(watchFile, processedFile);
    fs.rename(watchFile, processedFile, function(err) {
        if (err) throw err;
    });
});

watcher.start();
