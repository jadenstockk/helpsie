const Discord = require('discord.js');
const errHandler = require('../errorhandler');
const reactionroles = require('../functions/other/reactionroles');

module.exports = {
    init: (client) => {

        client.on("messageReactionRemove", async (reaction, user) => {
            try {
                if (reaction.message.partial) await reaction.message.fetch();
                if (reaction.partial) await reaction.fetch();
                if (user.bot) return;
                if (!reaction.message.guild) return;

                reactionroles.remove(reaction, user, client);
          
            } catch (err) {
                errHandler.init(err, __filename);
          
            }
          });
    }
}