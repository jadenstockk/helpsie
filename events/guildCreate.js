const Discord = require('discord.js');
const config = require('../config.json');
const errHandler = require('../errorhandler');
const guildLogs = new Discord.WebhookClient(config.guildlogID, config.guildlogTOKEN);

module.exports = {
    init: (client) => {

        client.on('guildCreate', async guild => {
            try {
                guildLogs.send(new Discord.MessageEmbed().setDescription(`**📥 Joined new guild:**\n\n**Name:** \`${guild.name}\`\n**ID:** \`${guild.id}\`\n**Member Count:** \`${guild.memberCount}\`\n**Owner:** ${guild.owner.user}\n‎‎‎‎‎    `).setColor("#00FF7F").setThumbnail(guild.iconURL()).setFooter(`Total Guilds: ${client.guilds.cache.size}`, client.user.displayAvatarURL()));
                await client.database.fetchGuildData(guild.id, client);

                const prefix = client.settings.get(guild.id).prefix;

                let welcomeEmbed = new Discord.MessageEmbed()
                .setColor("#059DFF")
                .setAuthor(`Thanks for adding me to your server!`, client.user.displayAvatarURL())
                .setDescription(`Hi there I'm ${client.user.username}. A powerful multipurpose Discord bot with features varying from moderation to reaction roles. ${client.user.username} makes it easy to create and customize your Discord server to your liking with a simple setup process!\n\n**Type \`${prefix}setup\` to be taken through the setup process to choose and customize the features you want to use**`)
                .setFooter(`Want to get straight into the commands? Type ${prefix}help for a list of commands`)
                .setThumbnail(client.user.displayAvatarURL())

                let channel = guild.channels.cache.find(x => x.type === 'text').id;

                const welcome = client.channels.cache.get(channel);
    
                welcome.send(welcomeEmbed);
                
            } catch (err) {
                errHandler.init(err, __filename);

            }
        })
    }
}