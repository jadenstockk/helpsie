const mongoose = require("mongoose");

let Schema = new mongoose.Schema({

    guild: String,

    prefix: String,

    profanityFilter: String,
    inviteBlocker: String,
    linkBlocker: String,

    autoModActions: Array,

    modRole: String,
    muteRole: String,

    disabled: Array,

    leveling: {
        channel: String,
        message: String,
        roles: Array,
    },

    birthdays: {
        channel: String,
        message: String,
        role: String,
    },

    welcome: {
        channel: String,
        message: String,
        role: String,
    },

    reactionRoles: Array,

    logsChannel: Object,

    blacklisted: Array,
    whitelisted: Array,

});

module.exports = mongoose.model("guildData", Schema);