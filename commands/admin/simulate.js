const guildMemberAdd = require("../../events/guildMemberAdd");

module.exports = {
    commands: 'simulate',
    permissions: 'ADMINISTRATOR',
    permissionError: `You have to be an administrator to use this command`,
    permissionMessage: true,
    description: `Use this command to simulate/test events that the bot handles such as when a member joins`,
    usage: `<event>`,
  
    callback: (message, args, client) => {
      const Discord = require("discord.js");

      let events = [
          `\`memberjoin\` - when a member joins the server`
      ]

      let event = args[0];
      if (!event) return message.channel.send(new Discord.MessageEmbed().setDescription(`**Choose one of the following events below to simulate:**\n\n${events.join('\n')}`).setColor("#059DFF"))

      event = event.toLowerCase();

      if (event === 'memberjoin') {
          let member = message.mentions.members.first() || message.member;
          guildMemberAdd.simulate(member, client);

      }

      else return message.channel.send(new Discord.MessageEmbed().setDescription(`**Choose one of the following events below to simulate:**\n\n${events.join('\n')}`).setColor("#059DFF"))
    },
  };