module.exports = {
    commands: 'disable',
    permissions: 'ADMINISTRATOR',
    permissionError: `You have to be an administrator to use this command`,
    permissionMessage: true,
    description: `Use this command to disable certain commands or command groups (command groups are groups of commands e.g. moderation)`,
    usage: `<command or command group>`,
  
    callback: (message, args, client) => {
      const Discord = require("discord.js");
      const guildData = require('../../models/guildData');
      const blacklistedCommands = ['disable', 'enable', 'help', 'commands', 'setup', 'disabled', 'settings', 'config', 'invite', 'support', 'admin'];
      const commandGroups = ['utilities', 'support', 'moderation', 'admin', 'leveling', 'birthdays'];

      let disableCommand = args[0].toLowerCase();

      if ((allCommands.includes(disableCommand) || commandGroups.includes(disableCommand)) && !blacklistedCommands.includes(disableCommand)) {
          let success = new Discord.MessageEmbed()
          .setDescription(`${checkEmoji} Successfully disabled the command: \`${disableCommand}\``)
          .setColor("#00FF7F")

          guildData.findOne(
            { guild: message.guild.id },
            async (err, data) => {
              if (err) console.log(err);
              if (!data) {

                let newData = new guildData({
                  guild: message.guild.id,
                  disabled: [disableCommand],
                });
                await newData.save();
                message.channel.send(success);

                client.database.fetchGuildData(message.guild.id, client);
        
              } else {

                if (!data.disabled) data.disabled = [disableCommand];
                else if (data.disabled.includes(disableCommand)) return message.channel.send(new Discord.MessageEmbed().setDescription(`${nopeEmoji} \`${disableCommand}\` is already disabled`).setColor("#FF3E3E"))
                else data.disabled.push(disableCommand);
                await data.save();

                message.channel.send(success);

                client.database.fetchGuildData(message.guild.id, client);

              }
            }
          );

      } else if (blacklistedCommands.includes(disableCommand)) {
        message.channel.send(
          new Discord.MessageEmbed()
          .setDescription(`${nopeEmoji} You cannot disable the command: \`${disableCommand}\``)
          .setColor("#FF3E3E")
          )

      } else if (!disableCommand) {
        message.channel.send(
          new Discord.MessageEmbed()
          .setDescription(`${nopeEmoji} You did not specify a command or command group to disable`)
          .setColor("#FF3E3E")
          )

      } else {
        message.channel.send(
          new Discord.MessageEmbed()
          .setDescription(`${nopeEmoji} Could not find the command or command group: \`${disableCommand}\``)
          .setColor("#FF3E3E")
          )

      }
    },
  };
  