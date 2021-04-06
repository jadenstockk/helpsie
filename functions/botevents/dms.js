const Discord = require("discord.js");
const config = require('../../config.json');
const dmLogs = new Discord.WebhookClient(config.dmsID, config.dmsTOKEN);

module.exports = {
  name: "dms",
  description: "bot dm logs",

  execute(message, args, client) {
    if (message.author.bot) return;
    if (client.blacklistedUsers && client.blacklistedUsers.find(person => person.user === message.author.id)) return message.author.send()

    let files = message.attachments.first();
    if (!files) dm = new Discord.MessageEmbed()
    .setDescription(`${message.author}\n${message.content}`)
    .setColor("#059DFF")

    else dm = new Discord.MessageEmbed()
    .setDescription(`${message.author}\n${message.content}`)
    .setColor("#059DFF")
    .attachFiles(files)

    dmLogs.send(dm);
  },
};