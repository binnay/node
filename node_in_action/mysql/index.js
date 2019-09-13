const http = require("http");
const work = require("./lib/timetrack.js");
const mysql = require("mysql");

const db = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "xxxxx",
    database: "timetrack"
});

const server = http.createServer(function(req, res) {
    console.log(req.method);
    switch (req.method) {
        case "POST":
            switch (req.url) {
                case "/add":
                    work.add(db, req, res);
                    break;
                case "/archive":
                    work.archive(db, req, res);
                    break;
                case "/unArchive":
                    work.unArchive(db, req, res);
                    break;
                case "/delete":
                    work.delete(db, req, res);
                    break;
                default:
                    break;
            }
            break;
        case "GET":
            switch (req.url) {
                case "/":
                    work.show(db, res);
                    break;
                case "/showArchived":
                    work.show(db, res, true);
                    break;
                default:
                    break;
            }
            break;
        default:
            break;
    }
});

db.query(
    "CREATE TABLE IF NOT EXISTS work (" +
        "id INT(10) NOT NULL AUTO_INCREMENT, " +
        "hours DECIMAL(5,2) DEFAULT 0, " +
        "date DATE, " +
        "archived INT(1) DEFAULT 0, " +
        "description LONGTEXT," +
        "PRIMARY KEY(id))",
    function(err) {
        if (err) throw err;
        console.log("Server started...");
        server.listen(3003, "127.0.0.1");
    }
);
