module.exports = (client) => {
    const Discord = require("discord.js");
    const clientTICKETS = new Discord.Client();
    const config = {
        "JADEN": "541189322007904266",
        "PREFIX": "s!",
        "TOKEN": require('./config.json').supportToken,
        "SERVER_ID": "794565558862479360",
        "CHANNEL_ID": "829849095610957825",
        "READY_MESSAGE": "Support Bot is now online",
        "ACTIVITY_STATUS": "support dms",
    }

    clientTICKETS.once("ready", async () => {

        console.log(config.READY_MESSAGE);
        clientTICKETS.user.setPresence({
            activity: {
                type: "LISTENING",
                name: config.ACTIVITY_STATUS
            },
            status: 'dnd'
        })

        client.block = false;
    });

    clientTICKETS.on("message", (message) => {
        if (message.author.bot) return;

        if (message.channel.type === "dm") {
            if (client.block) return message.channel.send("❌ **`Support messages aren't being accepted right now`**");
            var args = message.content.split(" ").slice(0)
            var args = args.slice(0).join(" ")
            var BOT_ID = clientTICKETS.user.id
            var userID = message.author.id
            if (message.content.startsWith(config.PREFIX)) return;
            if (message.author.bot) return;
            message.channel.send("**`This message has been sent to the staff!`** :incoming_envelope:");
            if (message.content.startsWith(config.PREFIX)) return
            if (args.length > 1024) return message.reply("**`Your message content too many characters (1024 Limit)`**");
            var embed = new Discord.MessageEmbed()
                .setColor("#ff6464")
                .setAuthor(`New Message from ${message.author.username}`, message.author.avatarURL())
                .setDescription(args)
                .setFooter(`${config.PREFIX}reply ${message.author.id}`)
                .setTimestamp()
            clientTICKETS.guilds.cache.get(config.SERVER_ID).channels.cache.get(config.CHANNEL_ID).send(embed);

        } else {
            if (message.content.startsWith(config.PREFIX + "reply")) {
                if ((message.author.id !== config.JADEN) && (!message.member.roles.cache.get(client.settings.get(message.guild.id).modRole))) return;
                var args = message.content.split(" ").slice(0)
                var Rargs = message.content.split(" ").slice(2).join(" ")
                var userID = args[1]
                if (isNaN(args[1])) return message.reply("This is not an ID! Make sure to you the user's ID!")
                var embed = new Discord.MessageEmbed()
                    .setColor("#ff6464")
                    .setAuthor(`New Message from ${clientTICKETS.user.username}`, clientTICKETS.user.displayAvatarURL())
                    .setDescription(Rargs)
                    .setFooter(message.author.username, message.author.displayAvatarURL())
                clientTICKETS.users.cache.get(userID).send(embed);
                if (message.author.bot) return;
                message.channel.send("**`Your Message was Sent!`** :incoming_envelope:");

            } else if (message.content.startsWith(config.PREFIX + "shutdown")) {
                if ((message.author.id !== config.JADEN)) return;

                client.block = true;
                message.channel.send('🟢 `Success`')

            } else if (message.content.startsWith(config.PREFIX + "unshutdown")) {
                if ((message.author.id !== config.JADEN)) return;

                client.block = false;
                message.channel.send('🟢 `Success`')
            }
        }
    });

    clientTICKETS.login(config.TOKEN);
}