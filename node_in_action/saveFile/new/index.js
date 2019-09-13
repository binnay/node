const fs = require("fs");
const path = require("path");
console.log(process.argv);
const args = process.argv.splice(2); //去掉'node cli_tasks.js'
const command = args.shift(); //取出第一个参数（命令）
const taskDescription = args.join(""); //合并剩余参数
const file = path.join(process.cwd(), "/.task.json"); //根据当前的工作目录解析数据库的相对路径

//这是个通过命令行来操作值存入文件的方法，没啥特别的代码

// 出现了writeFile写文件的方法，调用方法看node文档吧，入参种类还是很多
