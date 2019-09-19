const connect = require("connect");
const cookieParser = require("cookie-parser");
const app = connect()
    .use(cookieParser("tobi is a cool ferret")) //解析获取cookie，如果不用，req.cookies 和 req.signedCookies都是undefined
    .use(function(req, res, next) {
        console.log(req.cookies);
        console.log(req.signedCookies);
        res.setHeader("Set-Cookie", "foo=bar");
        res.setHeader(
            "Set-Cookie",
            "tobi=ferret;Expires=Tue, 08 Jun 2021 10:18:14 GMT"
        );
        res.end("hello\n");
    })
    .listen(3003);
