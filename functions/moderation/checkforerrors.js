const Discord = require("discord.js");
const errorhandler = require("../../errorhandler");

module.exports = (guild, roleCheck, missingPerms, client) => {
    let me = guild.me;

    function embed(text1, text2) {
        if (me.hasPermission('EMBED_LINKS')) return new Discord.MessageEmbed()
            .setDescription(`${nopeEmoji} **${text1}**\n${text2}\n\n**Need help? Join our support server:**\nhttps://discord.gg/5jaZRYnZU5`)
            .setColor("FF3E3E")

        else return `${nopeEmoji} **${text1}**\n${text2}\n\n**Need help? Join our support server:**\nhttps://discord.gg/5jaZRYnZU5`
    }
    if (missingPerms) return embed(`I am missing the \`${missingPerms}\` permission`, `Go into the roles section in server settings, click on my role, and then click the switch next to the missing permission under the permissions section`);

    if (roleCheck) if (roleCheck.position > me.roles.highest.position) return embed(`My highest role is too low in the server's role hierarchy`, `Go into the roles section in server settings and drag my role up to or near the top`);

    return false;
}