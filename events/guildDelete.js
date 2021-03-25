const Discord = require('discord.js');
const config = require('../config.json');
const errHandler = require('../errorhandler');
const guildLogs = new Discord.WebhookClient(config.guildlogID, config.guildlogTOKEN);

module.exports = {
    init: (client) => {

        client.on('guildDelete', guild => {
            try {
                guildLogs.send(new Discord.MessageEmbed().setDescription(`**📤 Removed from guild:**\n\n**Name:** \`${guild.name}\`\n**ID:** \`${guild.id}\`\n**Member Count:** \`${guild.memberCount}\`\n**Owner:** ${guild.owner.user}\n‎‎‎‎‎    `).setColor("#FF3E3E").setThumbnail(guild.iconURL()).setFooter(`Total Guilds: ${client.guilds.cache.size}`, client.user.displayAvatarURL()))
                client.database.fetchGuildData(guild.id, client)
                
            } catch (err) {
                errHandler.init(err, __filename);

            }
        })
    }
}