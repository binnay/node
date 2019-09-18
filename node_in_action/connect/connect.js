/**
 * 认证中间件，这是一个通用的认证组件，不会以任何方式专门绑定在/admin req.url上。
 * 但当你把它挂载到程序上时，只有请求URL以/admin开始时，才会调用它。这很重要，因为你只想对试图访问/admin URL的用户进行认证
 * 让常规用户仍能照常通行
 */

const connect = require("connect");
const app = connect();

app.listen(3000);

function restrict(req, res, next) {
    const authorization = req.headers.authorization;
    if (!authorization) return next(new Error("Unauthorized"));

    const parts = authorization.split(" ");
    const schema = parts[0];
    const auth = new Buffer(parts[1], "base64").toString().split(":");
    const user = auth[0];
    const pass = auth[1];

    // 根据数据库中的记录检查 认证信息的函数
    authenticateWithDatabase(user, pass, function(err) {
        //告诉分派器出错了
        if (err) return next(err);
        //如果认证信息有效，不带参数调用next()
        next();
    });
}
