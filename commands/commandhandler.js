const Discord = require('discord.js');
const errHandler = require('../errorhandler');
const errchecker = require('../functions/moderation/checkforerrors');

const validatePermissions = (permissions) => {
  const validPermissions = [
    'CREATE_INSTANT_INVITE',
    'KICK_MEMBERS',
    'BAN_MEMBERS',
    'ADMINISTRATOR',
    'MANAGE_CHANNELS',
    'MANAGE_GUILD',
    'ADD_REACTIONS',
    'VIEW_AUDIT_LOG',
    'PRIORITY_SPEAKER',
    'STREAM',
    'VIEW_CHANNEL',
    'SEND_MESSAGES',
    'SEND_TTS_MESSAGES',
    'MANAGE_MESSAGES',
    'EMBED_LINKS',
    'ATTACH_FILES',
    'READ_MESSAGE_HISTORY',
    'MENTION_EVERYONE',
    'USE_EXTERNAL_EMOJIS',
    'VIEW_GUILD_INSIGHTS',
    'CONNECT',
    'SPEAK',
    'MUTE_MEMBERS',
    'DEAFEN_MEMBERS',
    'MOVE_MEMBERS',
    'USE_VAD',
    'CHANGE_NICKNAME',
    'MANAGE_NICKNAMES',
    'MANAGE_ROLES',
    'MANAGE_WEBHOOKS',
    'MANAGE_EMOJIS',
  ]

  for (const permission of permissions) {
    if (!validPermissions.includes(permission)) {
      throw new Error(`Unknown permission node "${permission}"`)
    }
  }
}

module.exports = (client, commandOptions) => {

  let {
    commands,
    permissionError = `You aren't allowed to use this command.`,
    permissionMessage = true,
    modRequired = false,
    permissions = [],
    botPermissions = ['SEND_MESSAGES', 'EMBED_LINKS', 'READ_MESSAGE_HISTORY', 'USE_EXTERNAL_EMOJIS'],
    requiredRoles = [],
    callback,
  } = commandOptions

  if (typeof commands === 'string') {
    commands = [commands]
  }

  for (var i in commands) {
    allCommands.push(commands[i].toString());
    allCommandInfos.push(commandOptions);
  }

  if (permissions.length) {
    if (typeof permissions === 'string') {
      permissions = [permissions]
    }

    validatePermissions(permissions)
  }

  if (botPermissions.length) {
    if (typeof botPermissions === 'string') {
      botPermissions = [botPermissions]
    }

    validatePermissions(botPermissions)
  }

  client.on('message', async (message) => {
    if (message.author.bot) return;
    if (message.channel.type === 'dm') return;
    if (client.blacklistedUsers && client.blacklistedUsers.find(person => person.user === message.author.id)) return;
    
    try {

      const { member, content, guild } = message

      if (!client.settings.get(guild.id)) return;

      let prefix = process.env['PREFIX'];
      if (!prefix) client.settings.get(guild.id).prefix;
      if (!prefix) await client.database.fetchGuildData(guild.id, clients);

      const disabled = client.settings.get(guild.id).disabled;
      const clientMember = message.guild.members.cache.get(client.user.id);
  
      for (const alias of commands) {
        const command = `${prefix}${alias.toLowerCase()}`
        const command2 = `<@!${client.user.id}> ${alias.toLowerCase()}`
  
        if (
          content.toLowerCase().startsWith(`${command} `) ||
          content.toLowerCase() === command ||
          content.toLowerCase().startsWith(`${command2} `) ||
          content.toLowerCase() === command2
        ) {

          for (var i in disabled) {
            if (commands.includes(disabled[i])) return;
            
          }

          for (const permission of permissions) {
            if (!member.hasPermission(permission)) {
              if (permissionMessage) {
                let embed = new Discord.MessageEmbed()
                .setDescription(`${nopeEmoji} ${permissionError}`)
                .setColor("#FF3E3E")
  
                message.channel.send(embed)
              }
              return;
            }
          }

          for (const permission of botPermissions) {
            if (!clientMember.hasPermission(permission)) {
              if (permissionMessage) {

                let missingPermissions = [];
                for (const permission of botPermissions) {
                  if (!clientMember.hasPermission(permission)) {
                
                    let permissionFormatted = (permission.toLowerCase().charAt(0).toUpperCase() + permission.toLowerCase().slice(1)).replace('_', ' ').replace('_', ' ').replace('_', ' ');
                    let spaceCharacter = permissionFormatted.indexOf(' ');
                    if (spaceCharacter > -1) permissionFormatted = permissionFormatted.slice(0, spaceCharacter + 1) + permissionFormatted.charAt(spaceCharacter + 1).toUpperCase() + permissionFormatted.slice(spaceCharacter + 2, permissionFormatted.length)
                
                    let spaceCharacter2 = permissionFormatted.indexOf(' ', spaceCharacter + 1);
                    if (spaceCharacter2 > -1) permissionFormatted = permissionFormatted.slice(0, spaceCharacter2 + 1) + permissionFormatted.charAt(spaceCharacter2 + 1).toUpperCase() + permissionFormatted.slice(spaceCharacter2 + 2, permissionFormatted.length)

                    missingPermissions.push(`\`${permissionFormatted}\``)
                  }
                }

                let checkErrors = errchecker(guild, false, missingPermissions.join(', '));
                if (checkErrors) return message.channel.send(checkErrors);
              }
            }
          }
  
          if (modRequired) {
            if (!member.roles.cache.get(modRole)) {
              if (!member.hasPermission('ADMINISTRATOR')) {
                if (permissionMessage) {
                  let embed = new Discord.MessageEmbed()
                  .setDescription(`${nopeEmoji} ${permissionError}`)
                  .setColor("#FF3E3E")
    
                  message.channel.send(embed)
                }
                return;
              }
            }
          }
  

          for (const requiredRole of requiredRoles) {
            console.log(requiredRole)
            console.log(requiredRoles)
              if (!member.roles.cache.some(role => role.name === requiredRole)) {
              if (permissionMessage) {
                message.channel.send(`${nopeEmoji} **${permissionError}**`)
              }
              return;
            }
          }

          let commandDisabled = client.disabledCommands.find(disable => disable.command === alias)
          if (commandDisabled) return message.channel.send(new Discord.MessageEmbed().setDescription(`${logo} This command has been disabled by the ${client.user.username} Team\n**Reason:** ${commandDisabled.reason}`).setColor("#FF3E3E"));
  

          const args = content.split(/[ ]+/)
  

          args.shift()

          if (args[0] === alias) args.splice(0, 1)

          client.commandsRun = client.commandsRun + 1;
          callback(message, args, client);
            
        }
      }


        } catch(err) {
          errHandler.init(err, __filename, message)

        }
  })
}