const connect = require("connect");

// 跑起来之后， api路由为/api/user/1
const api = connect()
    .use(users)
    .use(pets)
    .use(errorHandler);

const app = connect()
    .use(hello)
    .use("/api", api)
    .use(errorPage)
    .listen(3000);

function hello(req, res, next) {
    if (req.url.match(/^\/hello/)) {
        res.end("Hello World\n");
    } else {
        next();
    }
}

const db = {
    users: [{ name: "tobi" }, { name: "loki" }, { name: "jane" }]
};

function users(req, res, next) {
    const match = req.url.match(/^\/user\/(.+)/);
    if (match) {
        const user = db.users[match[1]];
        if (user) {
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(user));
        } else {
            const err = new Error("User not found");
            err.notFound = true;
            next(err);
        }
    } else {
        next();
    }
}

function pets(req, res, next) {
    if (req.url.match(/^\/pet\/(.+)/)) {
        foo();
    } else {
        next();
    }
}

function errorHandler(err, req, res, next) {
    console.error(err.stack);
    res.setHeader("Content-Type", "application/json");
    // 用notFound来区分服务器错误还是系统错误
    if (err.notFound) {
        res.statusCode = 404;
        res.end(JSON.stringify({ error: err.message }));
    } else {
        res.statusCode = 500;
        res.end(JSON.stringify({ error: "Internal Server Error" }));
    }
}

function errorPage(err, req, res, next) {
    console.error(err);
    res.setHeader("Content-Type", "text/html");
    // 这里可以返回一些好看的界面
    if (err.notFound) {
        res.statusCode = 404;
        res.end(JSON.stringify({ error: err.message }));
    } else {
        res.statusCode = 500;
        res.end(JSON.stringify({ error: "Internal Server Error" }));
    }
}
