const init = async (client) => {
    const Discord = require('discord.js');
    const top = require('top.gg-core');
    const config = require('../config.json');
    const express = require("express");
    const bodyParser = require("body-parser");
    /*

    const topgg = new top.Client(config.topggToken);

    const app = express();
    const PORT = process.env.PORT || 5000;

    updateServerCount(client);

    function updateServerCount(client) {
        topgg.post({
            servers: client.guilds.cache.size
        });
    }

    app.use(bodyParser.json())
    
    app.listen(PORT, () => console.log(`Voting system running on port ${PORT}`))

    app.use(bodyParser.json())

    app.post("/topgg", async (req, res) => {
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
    })
    */
}
module.exports.init = init;
module.exports.updateServerCount = this.updateServerCount;