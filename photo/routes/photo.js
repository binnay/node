const express = require("express");
const router = express.Router();

router.get("/", function(req, res, next) {
    res.render("photos", {
        title: "Img preview",
        list: [
            {
                src:
                    "https://img.renlijia.com/201908/RLJRKF5u7yUZYQ3gIn1c063udk-1125-525.png",
                name: "统计提醒"
            },
            {
                src:
                    "https://img.renlijia.com/201907/RLJi2XvuErNiEz6Q6hq7Yg3NtO-460-256.png",
                name: "移交权限"
            },
            {
                src:
                    "https://img.renlijia.com/201907/RLJM95F7H01u324abU87F3OtP1-1500-1222.png",
                name: "工作通知"
            },
            {
                src:
                    "https://img.renlijia.com/201907/RLJf23x4nP2fy2qppofY1y7YW9-600-862.png",
                name: "操作日志"
            }
        ]
    });
});

module.exports = router;
