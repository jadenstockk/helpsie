const Discord = require('discord.js');
const client = new Discord.Client;
const config = require('./config.json');

module.exports = () => {
    client.once('ready', () => {
        client.user.setPresence({
            activity: {
                type: 'LISTENING',
                name: 'Jaden test me'
            }
        })
    })

    client.login(process.env['BETA_TOKEN']);
}