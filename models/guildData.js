const mongoose = require("mongoose");

let Schema = new mongoose.Schema({

    guild: String,

    prefix: {
        type: String,
        default: '!',
    },

    profanityFilter: String,
    inviteBlocker: String,
    linkBlocker: String,

    autoModActions: Array,

    modRole: String,
    muteRole: String,

    disabled: {
        type: Array,
        default: [],
    },

    leveling: {
        channel: String,
        message: String,
        roles: {
            type: Array,
            default: [],
        },
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

    reactionRoles: {
        type: Array,
        default: [],
    },

    logsChannel: {
        token: String,
        id: String,
        channelID: String,
    },

    blacklisted: Array,
    whitelisted: Array,

    tips: {
        type: Boolean,
        default: true,
    },

    limits: {
        levelroles: {
            type: Number,
            default: 15,
        },
        reactionroles: {
            type: Number,
            default: 15,
        },
        automodactions: {
            type: Number,
            default: 4,
        }
    }
});

module.exports = mongoose.model("guildData", Schema);