const mongoose = require("mongoose");

const user = new mongoose.Schema({
    firstname : String,
    lastname : String,
    username : {
        type : String,
        unique : true,
    },
    password : String,
});

const table = new mongoose.model("table", user);

module.exports = table;
