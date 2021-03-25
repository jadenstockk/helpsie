const Discord = require("discord.js");

module.exports = {
  commands: 'reactionroles',
  permissions: 'ADMINISTRATOR',
  permissionMessage: true,
  description: `Use this command to create or delete reaction roles (when a user reacts to specific message with a specific reaction, they gain a role)`,
  usage: `[optional new or delete] - (leaving the optional part out will provide a list of existing reaction roles)`,

  callback: (message, args, client) => {
    const prefix = client.settings.get(message.guild.id).prefix;
    const settings = client.settings.get(message.guild.id);

    let reactionRoles = [
        `**Reaction Roles:**`
    ]

    settings.reactionRoles.forEach(role => {
        reactionRoles.push(`${role.reaction} | ${role.channel} | ${role.role}`);
    });

    if (reactionRoles.length < 2) {
        reactionRoles.shift();
    }

    let reactionCommands = [
        `**Reaction Role Commands:**`,
        `\`${prefix}reactionroles new\``,
        `\`${prefix}reactionroles delete\``
    ]

    let reactionCommand = args[0];

    if (!reactionCommand) {
        let reactionRolesList = new Discord.MessageEmbed()
        .setColor("#059DFF")
        .setAuthor(`Reaction Roles`, client.user.displayAvatarURL())
        .setDescription(reactionCommands.join('\n') + '\n\n' + reactionRoles.join('\n'))
  
        message.channel.send(reactionRolesList);

    } else if (reactionCommand === 'new') {
        message.channel.send(new Discord.MessageEmbed()
        .setColor("#059DFF")
        .setAuthor(`Reaction Role Setup Process`, client.user.displayAvatarURL())
        .setDescription(`Would you like to create an embed or do you have an exisitng message?`))

    }
}
};