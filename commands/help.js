module.exports = {
  commands: 'help',

  callback: (message, args, client) => {
    const Discord = require("discord.js");

    let helpListType = args[0];
    const prefix = client.settings.get(message.guild.id).prefix;
    const disabled = client.settings.get(message.guild.id).disabled;
    const modRole = message.member.roles.cache.get(client.settings.get(message.guild.id).modRole)

    let supportEmbed = new Discord.MessageEmbed()
    .setAuthor(`Need some help or have a question?`, client.user.displayAvatarURL())
    .setDescription(`[Click here](https://discord.gg/5jaZRYnZU5) to join our support server for assistance!`)
    .setColor("#059DFF")

    function helpDisabled(group) {
      message.channel.send(
        new Discord.MessageEmbed()
        .setDescription(`${nopeEmoji} The command group \`${group}\` is currently disabled`)
        .setColor("#FF3E3E")
      )
    }

    let mainList = new Discord.MessageEmbed()
      .setColor("#059DFF")
      .setAuthor(`Commands List:`, client.user.displayAvatarURL())

    if (!disabled.includes('utilities')) mainList.addFields(
      { name: `**Utilities**`, value: `\`${prefix}help utilities\`\n\n`, inline: true }
    )
    if (!disabled.includes('leveling')) mainList.addFields(
      { name: `**Leveling**`, value: `\`${prefix}help leveling\`\n\n`, inline: true }
    )
    if (!disabled.includes('birthdays')) mainList.addFields(
      { name: `**Birthdays**`, value: `\`${prefix}help birthdays\`\n\n`, inline: true }
    )
    if ((modRole || message.member.hasPermission('ADMINISTRATOR')) && !disabled.includes('moderation')) mainList.addFields(
        { name: `**Moderation**`, value: `\`${prefix}help moderation\`\n\n`, inline: true }
      )
    if (message.member.hasPermission('ADMINISTRATOR')) mainList.addFields(
      { name: `**Admin**`, value: `\`${prefix}help admin\`\n\n`, inline: true },
      { name: `**Support**`, value: `\`${prefix}help support\`\n\n`, inline: true }
    )



    let utilityCommands = [
      `\`${prefix}userinfo <member>\`\nGet information about a certain member in the server`,
      `\`${prefix}youtube <video>\`\nSearch for a YouTube video`,
      `\`${prefix}imgur <image>\`\nSearch for an image on Imgur`,
      `\`${prefix}urban <word/phrase>\`\nGet a definition of a word`,
      `\`${prefix}covid <country/world>\`\nGet Covid-19 stats of a country or the world`,
      `\`${prefix}invite\`\nInvite the bot to your server`,
      `\`${prefix}ping\`\nGet the bot's response time in milliseconds`
    ]

    let utilityCommandsNumbers = [
      `userinfo`,
      `youtube`,
      `imgur`,
      `urban`,
      `covid`,
      `invite`,
      `ping`
    ]

    for (var i in disabled) {
      utilNumber = utilityCommandsNumbers.indexOf(`${disabled[i]}`);

      if (utilNumber > -1) {
        utilityCommands.splice(utilNumber, 1)
        utilityCommandsNumbers.splice(utilNumber, 1)

      }
    }

    let utilitiesList = new Discord.MessageEmbed()
      .setColor("#059DFF")
      .setAuthor(`Utility Commands:`, client.user.displayAvatarURL())
      .setDescription(utilityCommands.join('\n\n'))

      let birthdayCommands = [
        `\`${prefix}birthday [optional member]\`\nView your or another member's birthdays`,
        `\`${prefix}addbirthday <date>\`\nAdd your birthday`,
        `\`${prefix}removebirthday\`\nRemove your birthday`,
        `\`${prefix}upcomingbirthdays\`\nGet a list of the 10 next upcoming birthdays`,
        `\`${prefix}setbirthday <member> <date>\`\nSet another member's birthday`,
        `\`${prefix}unsetbirthday <member>\`\nRemove another member's birthday`,
      ]

      let birthdayCommandsNumbers = [
        `birthday`,
        `addbirthday`,
        `removebirthday`,
        `upcomingbirthdays`,
        `setbirthday`,
        `unsetbirthday`
      ]
  
      for (var i in disabled) {
        birthdayNumber = birthdayCommandsNumbers.indexOf(`${disabled[i]}`);
  
        if (birthdayNumber > -1) {
          birthdayCommands.splice(birthdayNumber, 1)
          birthdayCommandsNumbers.splice(birthdayNumber, 1)
  
        }
      }

      if (!message.member.hasPermission('ADMINISTRATOR')) {
        birthdayNumber = birthdayCommandsNumbers.indexOf(`setbirthday`);

        if (birthdayNumber > -1) {
          birthdayCommands.splice(birthdayNumber, 1)
          birthdayCommandsNumbers.splice(birthdayNumber, 1)
  
        }

        birthdayNumber = birthdayCommandsNumbers.indexOf(`unsetbirthday`);

        if (birthdayNumber > -1) {
          birthdayCommands.splice(birthdayNumber, 1)
          birthdayCommandsNumbers.splice(birthdayNumber, 1)
  
        }
      }
  
      let birthdayList = new Discord.MessageEmbed()
        .setColor("#059DFF")
        .setAuthor(`Birthday Commands:`, client.user.displayAvatarURL())
        .setDescription(birthdayCommands.join('\n\n'))

    let moderationCommands = [
      `\`${prefix}warn <member> [optional reason]\`\nWarn a member`, //0 warn
      `\`${prefix}warns <member>\`\nGet a list of a member's warns`, //1 warns
      `\`${prefix}findwarn <warn id>\`\nGet information about or delete a warn by it's id`, //2 findwarn
      `\`${prefix}mute <member> [optional duration] [optional reason]\`\nMute a member`, //3 mute
      `\`${prefix}unmute <member>\`\nUnmute a member`, //4 unmute
      `\`${prefix}clear <number of messages>\`\nDelete a certain amount of messages`, //5 clear
      `\`${prefix}kick <member> [optional reason]\`\nKick a member`, //6 kick
      `\`${prefix}ban <member> [optional reason]\`\nBan a member`, //7 ban
      `\`${prefix}unban <member> [optional reason]\`\nUnban a member`, //8 unban
      `\`${prefix}slowmode <time in seconds>\`\nSet slowmode in a channel`, //9 slowmode
      `\`${prefix}lock\`\nLock a channel`, //10 lock
      `\`${prefix}unlock\`\nUnlock a channel` //11 unlock
    ]

    let moderationCommandsNumbers = [
      `warn`, //0
      `warns`, //1
      `findwarn`, //1
      `mute`, //2
      `unmute`, //3
      `clear`, //4
      `kick`, //5
      `ban`, //6
      `unban`, //7
      `slowmode`, //8
      `lock`, //9
      `unlock` //10
    ]

      for (var i in disabled) {
        modNumber = moderationCommandsNumbers.indexOf(`${disabled[i]}`);

        if (modNumber > -1) {
          moderationCommands.splice(modNumber, 1)
          moderationCommandsNumbers.splice(modNumber, 1)

        }
      }
      
      let modList = new Discord.MessageEmbed()
        .setColor("#059DFF")
        .setAuthor(`Moderation Commands:`, client.user.displayAvatarURL())
        .setDescription(
          moderationCommands.join('\n\n')
        )

        let levelingCommands = [
          `\`${prefix}rank [optional member]\`\nGet the level and rank of a member`, //0 rank
          `\`${prefix}leaderboard\`\nGet a list of the top 10 members in the server`, //1 leaderboard
          `\`${prefix}addxp <member> <amount of xp>\`\nAdd xp to a member on the server`, //2 addxp
          `\`${prefix}removexp <member> <amount of xp>\`\nRemove xp from a member on the server`, //3 removexp
          `\`${prefix}resetxp <member>\`\nReset a member's xp on the server`, //4 resetxp
        ]
    
        let levelingCommandsNumbers = [
          `rank`, //0
          `leaderboard`, //1
          `addxp`, //2
          `removexp`, //3
          `resetxp`, //4
        ]
    
          for (var i in disabled) {
            levelNumber = levelingCommandsNumbers.indexOf(`${disabled[i]}`);
    
            if (levelNumber > -1) {
              levelingCommands.splice(levelNumber, 1)
              levelingCommandsNumbers.splice(levelNumber, 1)
    
            }
          }
          
          let levelingList = new Discord.MessageEmbed()
            .setColor("#059DFF")
            .setAuthor(`Leveling Commands:`, client.user.displayAvatarURL())
            .setDescription(
              levelingCommands.join('\n\n')
            )

            if (!message.member.hasPermission('ADMINISTRATOR')) {
              levelNumber = levelingCommandsNumbers.indexOf(`setbirthday`);
      
              if (levelNumber > -1) {
                levelingCommands.splice(levelNumber, 1)
                levelingCommandsNumbers.splice(levelNumber, 1)
        
              }
      
              levelNumber = levelingCommandsNumbers.indexOf(`unsetbirthday`);
      
              if (levelNumber > -1) {
                levelingCommands.splice(levelNumber, 1)
                levelingCommandsNumbers.splice(levelNumber, 1)
        
              }
            }


    let adminCommands = [
      `\`${prefix}setup\`\nRun the bot's setup process to more easily personalize it to your liking`,
      `\`${prefix}settings\`\nGet a list of all the bot's settings`,
      `\`${prefix}disable <command/command group>\`\nDisable a certain command or group of commands`,
      `\`${prefix}enable <command/command group>\`\nOnce disabled, enable a certain command or group of commands`,
      `\`${prefix}disabled\`\nGet a list of all the disabled commands in the server`,
      `\`${prefix}embed\`\nCreate beautiful message embeds with the embed creator`,
      `\`${prefix}reactionroles\`\nCreate and manage reaction roles`,
      `\`${prefix}moveall <channel id/channel name>\`\nMove everyone in a voice channel to a different channel of your choice`,
      `\`${prefix}muteall\`\nMute everyone except yourself in the voice channel you're in`,
      `\`${prefix}unmuteall\`\nUnmute everyone in the voice channel you're in`,
      `\`${prefix}simulate\`\nSimluate server events to test the bot's actions, such as simulating when a member joins`
    ]

    let adminCommandsNumbers = [
      `setup`,
      `settings`,
      `disable`,
      `enable`,
      `disabled`,
      `embed`,
      `reactionroles`,
      `moveall`,
      `muteall`,
      `unmuteall`
    ]

    for (var i in disabled) {
      adminNumber = adminCommandsNumbers.indexOf(`${disabled[i]}`);

      if (adminNumber > -1) {
        console.log(adminNumber)
        adminCommands.splice(adminNumber, 1)
        adminCommandsNumbers.splice(adminNumber, 1)

      }
    }

    let adminList = new Discord.MessageEmbed()
      .setColor("#059DFF")
      .setAuthor(`Admin Commands:`, client.user.displayAvatarURL())
      .setDescription(adminCommands.join('\n\n'))

      

      if (helpListType === 'utilities' || helpListType === 'utils') {
        if ((modRole || message.member.hasPermission('ADMINISTRATOR'))) {
          if (disabled.includes('utilities')) {
            return helpDisabled('utilities');

          }
          message.channel.send(utilitiesList);

        }

      } else if (helpListType === 'leveling' || helpListType === 'levels' || helpListType === 'level') {
          if (disabled.includes('leveling')) return helpDisabled('leveling');
          message.channel.send(levelingList);

      } else if (helpListType === 'moderation' || helpListType === 'mod') {

        if ((modRole || message.member.hasPermission('ADMINISTRATOR'))) {
          if (disabled.includes('moderation')) {
            return helpDisabled('moderation');

          }
          message.channel.send(modList);

        }

      } else if (`${helpListType}`.startsWith('admin')) {

        if (message.member.hasPermission('ADMINISTRATOR')) {
          message.channel.send(adminList);
        }

      } else if (`${helpListType}`.startsWith('support')) {
        message.channel.send(supportEmbed);

      } else if (helpListType === 'birthday' || helpListType === 'bday' || helpListType === 'birthdays') {
        message.channel.send(birthdayList);

      } else {
        message.channel.send(mainList);
      }
  },
};
