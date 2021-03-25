const mongoose = require("mongoose");

let Schema = new mongoose.Schema({

    mainID: Number,
    commandsRun: Number,
    users: Number,
    guilds: Number,

});

module.exports = mongoose.model("botInfo", Schema);