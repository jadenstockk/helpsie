const init = async (client) => {
    const Discord = require('discord.js');
    const top = require('top.gg-core');
    const express = require("express");
    const bodyParser = require("body-parser");

    const topgg = new top.Client('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijc5MzQ0ODQxOTk2MzgzMDI3NCIsImJvdCI6dHJ1ZSwiaWF0IjoxNjEwODI1NDIyfQ.dAIr4Ai1TybtOdeKhvs74EslT3JYsTyYDK2o52DEso8');

    const app = express();
    const PORT = process.env.PORT || 5000;

    updateServerCount(client);

    function updateServerCount(client) {
        topgg.post({
            servers: client.guilds.cache.size
        });
    }

    app.use(bodyParser.json())
    
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

    app.use(bodyParser.json())

    app.post("/topgg", async (req, res) => {
        await topgg.votes().then(votes => {
            let userVotes = votes.filter(vote => vote.id === req.body.user)
            client.users.cache.get(req.body.user).send(new Discord.MessageEmbed().setColor('BLUE').setDescription(`Thanks for voting for **New Year** on **[top.gg](https://top.gg/bot/793448419963830274)**! You now have a total of **${userVotes.length}** votes this month`))
        })
        res.status(200).end()
    })
}
module.exports.init = init;
module.exports.updateServerCount = this.updateServerCount;