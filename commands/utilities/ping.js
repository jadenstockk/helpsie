module.exports = {
  commands: ['ping'],
  group: 'utilities',

  callback: (message, args, client) => {
    const Discord = require("discord.js");
    const timeconverter = require("@danm/timespent");

    message.channel.send(`\`Calculating ping...\``).then(msg => {
      let ping = msg.createdTimestamp - message.createdTimestamp

      msg.edit(`**Bot Ping:** \`${ping}ms\`\n**API Ping:** \`${client.ws.ping}ms\`\n**Uptime:** \`${timeconverter.short(client.uptime)}\``)
    })
  },
};