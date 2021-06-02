const CryptoJS = require('crypto-js');
const configMain = require("../../config.json");
const path = require('path');

async function getMutualGuilds(userGuilds, botGuilds) {
    if (!userGuilds || !botGuilds) return undefined;
    const validGuilds = await userGuilds.filter((guilds) => (guilds.permissions & 0x20) === 0x20);
    const included = [];
    const excluded = await validGuilds.filter((guild) => {
        const findGuild = botGuilds.find((g) => g.id === guild.id);
        if (!findGuild) return guild;
        included.push(findGuild);
    });
    return {
        excluded,
        included
    };
}

function encrypt(token) {
    return CryptoJS.AES.encrypt(token, process.env['SECRET_ENCRYPT_PHRASE']).toString();
}

function decrypt(token) {
    return CryptoJS.AES.decrypt(token, process.env['SECRET_ENCRYPT_PHRASE']).toString(CryptoJS.enc.Utf8);
}

module.exports = {
    getMutualGuilds,
    encrypt,
    decrypt
};