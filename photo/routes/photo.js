const express = require("express");
const router = express.Router();
const fs = require("fs");
const photoModels = require("../models/Photo.js");
const path = require("path");
const resolve = path.resolve;
const mongoose = require("mongoose");

router.get("/", function(req, res, next) {
    photoModels.find({}, function(err, photos) {
        if (err) return next(err);
        res.render("photos", {
            title: "Img preview",
            list: photos
        });
    });
});

router.get("/upload", function(req, res, next) {
    res.render("upload", {
        title: "图片上传"
    });
});

router.post("/upload", function(req, res, next) {
    const uploadObj = req.files.fileObj;
    const path = uploadObj.path;
    const type = uploadObj.type.split("/")[1];
    const fields = req.fields;
    const imgName = fields.name;
    const imgPath = path + imgName + "." + type;
    fs.rename(path, imgPath, function(err) {
        if (err) return next(err);
        photoModels.create(
            {
                name: imgName,
                path:
                    path.split("/")[path.split("/").length - 1] +
                    imgName +
                    "." +
                    type
            },
            function(err) {
                if (err) return next(err);
                res.redirect("/photo");
            }
        );
    });
});

router.get("/del/:id", function(req, res, next) {
    const _id = mongoose.Types.ObjectId(req.params.id);
    photoModels.deleteOne(
        {
            _id
        },
        function(err) {
            if (err) return next(err);
            res.redirect("/photo");
        }
    );
});

router.get("/down/:id", function(req, res, next) {
    const _id = req.params.id;
    photoModels.findById(_id, function(err, obj) {
        if (err) return next(err);
        const path = resolve(__dirname, "../public/photos/" + obj.path);
        // res.sendFile(path);
        res.download(path);
    });
});

module.exports = router;
