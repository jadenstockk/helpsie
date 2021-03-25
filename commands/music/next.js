const checkQueue = require("../../functions/music/checkQueue");

module.exports = {
    commands: ['next', 'skip', 'fs'],

    callback: async (message, args, client) => {
        const Discord = require('discord.js');

        try {

            if (!client.currentlyPlaying) return;

            if (!message.member.roles.cache.find(role => role.name === 'DJ') && !message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(
                new Discord.MessageEmbed()
                .setAuthor(`You have to be a DJ to use this command`, client.user.displayAvatarURL())
                .setColor("RED")
            );

            message.channel.send(
                new Discord.MessageEmbed()
                .setAuthor(`Skipped to next song on the queue`, client.user.displayAvatarURL())
                .setColor("#059DFF")
            );
            client.savedCurrent = undefined;
            checkQueue.run(client, message, 'nextCommandAuth');


        } catch(err) {
            console.log(err);
            
        }
    }
}