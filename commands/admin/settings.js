const { fetchLatest } = require("../../main");

module.exports = {
    commands: ['settings', 'config'],
    permissions: 'ADMINISTRATOR',
    permissionError: `You have to be an administrator to use this command`,
    permissionMessage: true,
    botPermissions: ['ADD_REACTIONS'],
    description: `Use this command to get a list of or change the bot's settings to your liking`,
    usage: `[optional setting] [optional new setting option] - leave the optional parts out to get a full list of all the bot's settings`,

    callback: (message, args, client) => {
      const Discord = require("discord.js");
      const guildData = require('../../models/guildData');

      const prefix = client.settings.get(message.guild.id).prefix;
      const currentSettings = client.settings.get(message.guild.id);
      let commandPrefix = `${prefix}settings`;

      let setting = args[0];
      let settinginfo = args[1];

      function lastestData() {
        let data = fetchLatest(message.guild);
        function setting(type, special) {
          let value = eval(type);

          if (value && special)
          if (special === 'channel') value = message.guild.channels.cache.get(value);
          else if (special === 'role') value = message.guild.roles.cache.get(value);
          else if (special === 'message' && value === 'off') value === '\`off\`';

          if (!value && (!special)) value = 'off';
          else if (!value && special) value = '\`off\`';

          return value;
        }

        p1 = [
          `**General Settings:**\n\n`,
          `\`${commandPrefix} prefix <new prefix>\` - ***currently set to: \`${setting('data.prefix')}\`***\nSet a new prefix for the bot *e.g. ${commandPrefix} prefix ?*\n\n`,
        ]
        p2 = [
          `**Moderation Settings:**\n\n`,
          `\`${commandPrefix} logs <channel/off>\` - ***currently set to: ${setting('data.logsChannel.channelID', 'channel')}***\nSet a new prefix for the bot\nSet a server logs channel where server events will be recorded *e.g. ${commandPrefix} logs #server-logs*\n\n`,
          `\`${commandPrefix} moderator <role>\` - ***currently set to: ${setting('data.modRole', 'role')}***\nSet a role that will have access to moderator commands *e.g. ${commandPrefix} moderator @moderators*\n\n`,
          `\`${commandPrefix} muted <role>\` - ***currently set to: ${setting('data.muteRole', 'role')}***\nSet a role that will be given to members when they are muted *e.g. ${commandPrefix} muted @mute-role*\n\n`,
        ]
        p3 = [
          `**Automod Settings:**\n\n`,
          `\`${commandPrefix} profanityfilter <warn/warndelete/delete/off>\` - ***currently set to: \`${setting('data.profanityFilter')}\`***\nWhen on, the bot will filter bad words in messages, nicknames and links - choose whether you want the bot to warn, delete or warn and delete content containing profanity *e.g. ${commandPrefix} profanityfilter warndelete*\n\n`,
          `\`${commandPrefix} inviteblocker <warn/warndelete/delete/off>\` - ***currently set to: \`${setting('data.inviteBlocker')}\`***\nWhen on, the bot will filter all server invite links sent - choose whether you want the bot to warn, delete or warn and delete content containing invite links *e.g. ${commandPrefix} inviteblocker warndelete*\n\n`,
          `\`${commandPrefix} linkblocker <warn/warndelete/delete/off>\` - ***currently set to: \`${setting('data.linkBlocker')}\`***\nWhen on, the bot will delete all links sent - choose whether you want the bot to warn, delete or warn and delete content containing links *e.g. ${commandPrefix} linkblocker warndelete*\n\n`,
        ]
        p4 = [
          `**Automod Action Settings:**\n\n`,
          `\`${commandPrefix} actions\`\nGet a list of all the server's automod actions *e.g. ${commandPrefix} actions*\n\n`,
          `\`${commandPrefix} actions new\`\nCreate a new action that will either kick, ban or mute a member depending on the number of warnings they've gotten in a certain amount of time *e.g. ${commandPrefix} actions new*\n\n`,
          `\`${commandPrefix} actions delete <action number>\`\nDelete an existing automod action *e.g. ${commandPrefix} actions delete 3*\n\n`,
        ]
        p5 = [
          `**Welcome Settings:**\n\n`,
          `\`${commandPrefix} welcomechannel <channel>\` - ***currently set to: ${setting('data.welcome.channel', 'channel')}***\nSet a channel where new server members will be greeted *e.g. ${commandPrefix} welcomechannel #welcome-channel*\n\n`,
          `\`${commandPrefix} welcomemessage <message/off>\` - ***currently set to:*** ${setting('data.welcome.message', 'message')}\nSet a message that will be sent in the welcome channel *e.g. ${commandPrefix} welcomemessage Hey {user}! Welcome to {server}!*\n\n`,
          `\`${commandPrefix} welcomerole <role/off>\` - ***currently set to: ${setting('data.welcome.role', 'role')}***\nChoose a role that will be given to new server members when they join *e.g. ${commandPrefix} welcomerole @member*\n\n`,
        ]
        p6 = [
          `**Leveling Settings:**\n\n`,
          `\`${commandPrefix} levelchannel <channel/off>\` - ***currently set to: ${setting('data.leveling.channel', 'channel')}***\nSet a channel where member levelups will be announced *e.g. ${commandPrefix} levelchannel #level-ups*\n\n`,
          `\`${commandPrefix} levelmessage <message/off>\` - ***currently set to:*** ${setting('data.leveling.message', 'message')}\nSet a message that will be sent when a user levels up - use "{user}" to mention the user that's leveling up, and "{level}" to display the level *e.g. ${commandPrefix} levelmessage Well done {user} you just reached level {level}! 🥳*\n\n`,
          `\`${commandPrefix} levelroles\`\nCreate new level role rewards when members reach a certain level *e.g. ${commandPrefix} levelroles*\n\n`,
        ]
        p7 = [
          `**Birthday Settings:**\n\n`,
          `\`${commandPrefix} birthdaychannel <channel>\` - ***currently set to: ${setting('data.birthdays.channel', 'channel')}***\nSet a channel where member levelups will be announced *e.g. ${commandPrefix} birthdaychannel #level-ups*\n\n`,
          `\`${commandPrefix} birthdaymessage <message/off>\` - ***currently set to:*** ${setting('data.birthdays.message', 'message')}\nSet a message that will be sent when it's a user's birthday - use "{user}" to mention the user who's birthday it is *e.g. ${commandPrefix} birthdaymessage Today is {user}'s Birthday! Make sure you wish them on their special day! 🥳*\n\n`,
          `\`${commandPrefix} birthdayrole <role/off>\` - ***currently set to:*** ${setting('data.birthdays.role', 'role')}\nChoose a role to give to members when it's their birthday *e.g. ${commandPrefix} birthdayrole @its-my-birthday*\n\n`,
        ]
      }

      let pageNumber = 0;
      let maxPage = 6;

      if (!isNaN(setting)) pageNumber = parseInt(setting) - 1, setting = undefined;
      if ((pageNumber < 0) || (pageNumber > maxPage)) pageNumber = 0;

      if (!setting) {

        message.channel.send(page(pageNumber)).then(msg => {

          msg.react('◀').then(r => {
            msg.react('▶')
          })
      
          const backwardsFilter = (reaction, user) => reaction.emoji.name === '◀' && user.id === message.author.id;
          const forwardsFilter = (reaction, user) => reaction.emoji.name === '▶' && user.id === message.author.id;
      
          const backwards = msg.createReactionCollector(backwardsFilter, { time: 300000 });
          const forwards = msg.createReactionCollector(forwardsFilter, { time: 300000 });
      
          backwards.on('collect', r => {

            r.users.remove(message.author)

            if (pageNumber === 0) return;
      
            pageNumber--;
            msg.edit(page(pageNumber))
          })
      
          forwards.on('collect', r => {

            r.users.remove(message.author)

            if (pageNumber === maxPage - 1) return;
      
            pageNumber++;
            msg.edit(page(pageNumber));
          })
      
          backwards.on('end', r => {
            msg.reactions.removeAll();
          })
        })

        function page(page) {
          lastestData();

          /*
          slice1 = page * 4;
          slice2 = slice1 + 4;
  
          settingsList = new Discord.MessageEmbed()
          .setAuthor(`${message.guild.name} Server Settings:`, message.guild.iconURL())
          .setDescription(allSettings.slice(slice1, slice2).join(''))
          .setFooter(`Page ${page + 1} of ${maxPage}`)
          .setColor("#059DFF")

          return settingsList;
          */

          if (page === 0) list = p1.concat(p2);
          else if (page === 1) list = p3;
          else if (page === 2) list = p4;
          else if (page === 3) list = p5;
          else if (page === 4) list = p6;
          else if (page === 5) list = p7;
          else list = [`Error when loading settings page`];

          settingsList = new Discord.MessageEmbed()
          .setAuthor(`${message.guild.name} Server Settings:`, message.guild.iconURL())
          .setDescription(list.join(''))
          .setFooter(`Page ${page + 1} of ${maxPage}`)
          .setColor(process.env['EMBED_COLOR'])

          return settingsList;
        }
        
      } else {
        
        client.functions.get('settings').execute(message, args, client, setting, settinginfo, currentSettings);

    }
  },
};