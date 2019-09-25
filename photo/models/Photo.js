const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/photos", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const schema = new mongoose.Schema({
    name: String,
    path: String
});

module.exports = mongoose.model("Photo", schema);
