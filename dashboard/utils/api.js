const fetch = require('node-fetch');
const { decrypt } = require('./utils');
const token = process.env['TOKEN'];

const DiscordAPI = 'http://discord.com/api/v6';

async function getBotGuilds() {
    const response = await fetch(`${DiscordAPI}/users/@me/guilds`, {
        method: 'GET',
        headers: {
            Authorization: `Bot ${token}`
        }
    })
    return response.json();
}

async function getUserGuilds(accessToken) {
    const response = await fetch(`${DiscordAPI}/users/@me/guilds`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${decrypt(accessToken)}`
        }
    })
    return response.json();
}

module.exports = { getBotGuilds, getUserGuilds };