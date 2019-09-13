const qs = require("querystring");

exports.sendHTML = function(res, html) {
    res.setHeader("Content-Type", "text/html");
    res.setHeader("Content-Length", Buffer.byteLength(html));
    res.end(html);
};

exports.parseReceivedData = function(req, cb) {
    let body = "";
    req.setEncoding("utf8");
    req.on("data", function(chunk) {
        body += chunk;
    });
    req.on("end", function() {
        const data = qs.parse(body);
        cb(data);
    });
};

exports.actionForm = function(id, path, label) {
    const html =
        '<form method="POST" action="' +
        path +
        '">' +
        '<input type="hidden" name="id" value="' +
        id +
        '" />' +
        '<input type="submit" value="' +
        label +
        '"/>' +
        "</form>";
    return html;
};

exports.add = function(db, req, res) {
    exports.parseReceivedData(req, function(work) {
        db.query(
            "INSERT INTO work (hours, date, description) " +
                " VALUES (?, ?, ?)",
            [work.hours, work.date, work.description],
            function(err) {
                if (err) throw err;
                exports.show(db, res);
            }
        );
    });
};

exports.delete = function(db, req, res) {
    exports.parseReceivedData(req, function(work) {
        db.query("DELETE FROM work WHERE id=?", [work.id], function(err) {
            if (err) throw err;
            exports.show(db, res);
        });
    });
};

exports.archive = function(db, req, res) {
    exports.parseReceivedData(req, function(work) {
        db.query("UPDATE work SET archived=1 WHERE id=?", [work.id], function(
            err
        ) {
            if (err) throw err;
            exports.show(db, res);
        });
    });
};

exports.unArchive = function(db, req, res) {
    exports.parseReceivedData(req, function(work) {
        db.query("UPDATE work SET archived=0 WHERE id=?", [work.id], function(
            err
        ) {
            if (err) throw err;
            exports.show(db, res, true);
        });
    });
};

exports.show = function(db, res, showArchived) {
    const query =
        "SELECT * FROM work " + "WHERE archived=? " + "ORDER BY date DESC";
    const archiveValue = showArchived ? 1 : 0;
    db.query(query, [archiveValue], function(err, rows) {
        if (err) throw err;
        let html = showArchived
            ? '<a href="/">unArchived Work</a><br/>'
            : '<a href="/showArchived">Archived Work</a><br/>';
        html += exports.workHitListHtml(rows);
        html += exports.workFormHtml();
        exports.sendHTML(res, html);
    });
};

// 显示已添加项
exports.workHitListHtml = function(rows) {
    let html = "<table>";
    for (let i in rows) {
        html += "<tr>";
        html += "<td>" + rows[i].date + "</td>";
        html += "<td>" + rows[i].hours + "</td>";
        html += "<td>" + rows[i].description + "</td>";
        if (!rows[i].archived) {
            html += "<td>" + exports.workArchiveForm(rows[i].id) + "</td>";
        } else {
            html +=
                "<td>" + exports.workArchiveForm(rows[i].id, true) + "</td>";
        }
        html += "<td>" + exports.workDeleteFrom(rows[i].id) + "</td>";
        html += "</tr>";
    }
    html += "</table>";
    return html;
};

// 显示添加form
exports.workFormHtml = function() {
    let html =
        '<form method="POST" action="/add">' +
        '<p>Date (YYYY-MM-D):<br/><input name="date" type="text"/></p>' +
        '<p>Hours worked:<br/><input name="hours" type="text"/></p>' +
        "<p>Description:<br/>" +
        '<textarea name="description"></textarea></p>' +
        '<button type="submit">Add</button>' +
        "</form>";
    return html;
};

exports.workArchiveForm = function(id, type) {
    if (type) return exports.actionForm(id, "/unArchive", "unArchive");
    else return exports.actionForm(id, "/archive", "Archive");
};

exports.workDeleteFrom = function(id) {
    return exports.actionForm(id, "/delete", "Delete");
};
