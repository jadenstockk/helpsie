const { ban } = require("../../functions/moderation/actions");

module.exports = {
  commands: 'ban',
  permissions: 'BAN_MEMBERS',
  permissionError: `You aren't allowed to ban members`,
  permissionMessage: true,
  botPermissions: ['BAN_MEMBERS'],
  description: `Use this command to ban members from the server`,
  usage: `<member>`,

  callback: (message, args, client) => {
    const Discord = require("discord.js");

      if (message.author.bot) return;

      let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
      if (!user) return message.channel.send(
        new Discord.MessageEmbed()
        .setDescription(`${nopeEmoji} You didn't mention a valid member to ban`)
        .setColor("#FF3E3E")
        );

      let reason = args.slice(1).join(' ');
      if (!reason) reason = 'Unspecified';

      ban(user, message.guild, message.author, reason, client, message);
  },
};

