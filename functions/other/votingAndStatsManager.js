const Discord = require('discord.js');
const config = require('../../config.json');
const top = require('top.gg-core');
const dbots = require('dbots')
const express = require("express");
const bodyParser = require("body-parser");
const errorhandler = require('../../errorhandler');
const globalUserData = require('../../models/globalUserData');
const spacetime = require('spacetime');

module.exports = {
    listen: (client) => {

        const app = express();
        const PORT = 25579 || 5000;

        let sites = client.votingSites;

        app.use(bodyParser.json())

        app.listen(PORT, () => console.log(`Voting system running on port ${PORT}`))

        app.use(bodyParser.json());

        app.post('/botlists/:site', async (req, res) => {
            if (req.headers.authorization !== config.authCode) return res.status(200).end();
            let site = sites.find(s => s.code === req.params.site);
            if (!site) return res.status(200).end();

            let user;
            if (site.code === 'dbl') user = req.body.id;
            else user = req.body.user;
            if (!user) return console.log('No voting user found');

            user = client.users.cache.get(user);
            if (!user) return console.log('No voting user found in client cache');

            try {
                let data = await globalUserData.findOne({
                    user: user.id
                });
                let vote = {
                    site: site.code,
                    timestamp: spacetime.now().epoch,
                }

                if (!data) {
                    let newData = new globalUserData({
                        user: user.id,
                        votes: [],
                    })

                    data = newData;
                }
                if (!data.votes) data.votes = [];
                data.votes.push(vote);
                data.save();

                user.send(
                    new Discord.MessageEmbed()
                    .setColor('BLUE')
                    .setAuthor(`${client.user.username} Voting Rewards`, client.user.displayAvatarURL())
                    .setDescription(`Thanks for voting for **${client.user.username}** on **[${site.name}](${site.link})**!\nYou now have a total of **${data.votes.length}** voting credits (rewards for voting coming soon)`))
                res.status(200).end()

            } catch (err) {
                errorhandler.init(err, __filename);

            }
        });
    },

    update: async (client) => {
        let users = 0;
        await client.guilds.cache.forEach(guild => {
            users = users + guild.memberCount;
        })

        const poster = new dbots.Poster({
            clientID: '781293073052991569',
            apiKeys: {
                discordbotlist: config.dblToken,
                topgg: config.topggToken,
                botsfordiscord: config.bfdToken,
                blist: config.blistToken
            },
            serverCount: async () => client.guilds.cache.size,
            userCount: async () => users,
            voiceConnections: async () => 0
        })
        poster.post();
    }
}