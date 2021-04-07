const Discord = require('discord.js');
const client = new Discord.Client;
const config = require('./config.json');

module.exports = () => {
    client.once('ready', () => {
        client.user.setPresence({
            activity: {
                type: 'LISTENING',
                name: 'jaden code'
            }
        })
    })

    if (!process.env['BETA_TOKEN']) return;
    else client.login(process.env['BETA_TOKEN']);
}