/*
const init = async (users, client) => {
    const Discord = require('discord.js');
    const config = require('../config.json');
    const top = require('top.gg-core');
    const express = require("express");
    const bodyParser = require("body-parser");
    

    const appname = process.env.HEROKU_APP_NAME;
    if (appname) {
        require('heroku-self-ping').default(`https://${appname}.herokuapp.com`);
    }

    const dbots = require('dbots')

    const topgg = new top.Client(config.topggToken);

    const app = express();
    const PORT = process.env.PORT || 5000;

    updateServerCount(users, client);

    function updateServerCount(users, client) {
        const poster = new dbots.Poster({
            clientID: '781293073052991569',
            apiKeys: {
                discordbotlist: config.dblToken,
            },
            serverCount: async () => client.guilds.cache.size,
            userCount: async () => users,
            voiceConnections: async () => 0
        })
        poster.post();
        //topgg.post({ servers: client.guilds.cache.size });
    }

    app.use(bodyParser.json())

    app.listen(PORT, () => console.log(`Voting system running on port ${PORT}`))

    app.use(bodyParser.json())

    app.post("/dbl", async (req, res) => {
        try {
            console.log(req.body);
            let user = client.users.cache.get(req.body.id);
            user.send(
                new Discord.MessageEmbed()
                .setColor('BLUE')
                .setAuthor(`${client.user.username} Voting Rewards`, client.user.displayAvatarURL())
                .setDescription(`${logo} Thanks for voting for **${client.user.username}** on **[discordbotlist.com](https://discordbotlist.com/bots/helpsie)**! ${logo}`))

            res.status(200).end()

        } catch (err) {

        }
    })

    app.post("/topgg", async (req, res) => {
        try {
            await topgg.votes().then(votes => {
                let userVotes = votes.filter(vote => vote.id === req.body.user);
                let user = client.users.cache.get(req.body.user);

                user.send(
                    new Discord.MessageEmbed()
                    .setColor('BLUE')
                    .setAuthor(`${client.user.username} Voting Rewards`, client.user.displayAvatarURL())
                    .setDescription(`${logo} Thanks for voting for **${client.user.username}** on **[top.gg](https://top.gg/bot/793448419963830274)**! ${logo}\nYou now have a total of **${userVotes.length}** votes this month`))
            })
            res.status(200).end()
        } catch (err) {

        }
    })
}
module.exports.init = init;
module.exports.updateServerCount = this.updateServerCount;
*/