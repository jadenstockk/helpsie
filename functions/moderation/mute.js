const Discord = require("discord.js");
const timestring = require('timestring');
const ms = require('ms');
const database = require('../../database');
const timetostring = require('@danm/timespent');
const serverlogs = require("./serverlogs");
const { expire } = require("../../database");
const errorhandler = require("../../errorhandler");
const checkpunishability = require("./checkforerrors");

module.exports = {
    mute: async (user, guild, seconds, moderator, reason, client, message) => {

        let settings = client.settings.get(guild.id);

        let muteRole = (
            guild.roles.cache.get(settings.muteRole) ||
            guild.roles.cache.find((role) => role.name === "Muted") ||
            guild.roles.cache.find((role) => role.name === "muted")
        )

        if (user.user.bot) return errorMessage(`You are not allowed to mute bots`);
        if (user.hasPermission("ADMINISTRATOR")) return errorMessage(`You aren't allowed to mute admins`);

        function errorMessage(problem) {
            if (!message) return;

            message.channel.send(
                new Discord.MessageEmbed()
                .setDescription(`${nopeEmoji} ${problem}`)
                .setColor("FF3E3E")
            )
        }

        if (!muteRole) await guild.roles.create({
            data: {
                name: "Muted",
                permissions: false,
                color: '818386',
                position: 1,
            }
        }).then(role => {
            muteRole = role;
            client.database.updateGuildData(guild.id, client, 'muteRole', role.id);

            guild.channels.cache.forEach(async channel => {

                channel.overwritePermissions([{
                    id: role.id,
                    deny: ['SEND_MESSAGES'],
                }, ]);

            })
        })

        let checkPerms = checkpunishability(message.guild, muteRole);
        if (checkPerms) return message.channel.send(checkPerms);

        const redisClient = await database.redisClient;
        try {
            const redisKey = `muted-${user.id}-${guild.id}`;

            if (seconds > 0) timeString = timetostring.short(ms(seconds + ' seconds'));
            else timeString = '∞';

            if (seconds > (ms('1 year') / 1000)) return errorMessage(`You cannot mute someone for over 1 year`);

            await redisClient.get(redisKey, async (err, result) => {

                if (err) {
                    errorhandler.init(err, __filename);

                } else {
                    let getRole = user.roles.cache.get(muteRole.id);

                    if (getRole && result) return errorMessage(`You cannot mute someone that is already muted`);
                    else await muteDataAdd();
                }

                async function muteDataAdd() {

                    user.roles.add(muteRole, 'Muted member');

                    if (message) {
                        let muteDurationOptional = '';

                        if (seconds > 0) muteDurationOptional = `for ${timeString}`;

                        let mutedMessageChannelSend = new Discord.MessageEmbed()
                            .setAuthor(`${user.user.tag} has been muted ${muteDurationOptional}`, user.user.displayAvatarURL({
                                dynamic: true
                            }))
                            .setDescription(`**Reason:** ${reason}`)
                            .setColor("#FF3E3E")

                        if (reason === 'Unspecified') mutedMessageChannelSend = new Discord.MessageEmbed()
                            .setAuthor(`${user.user.tag} has been muted ${muteDurationOptional}`, user.user.displayAvatarURL({
                                dynamic: true
                            }))
                            .setColor("#FF3E3E")

                        message.channel.send(mutedMessageChannelSend);
                    }

                    if (seconds > 0) {
                        await redisClient.set(redisKey, 'true', 'EX', seconds);

                    } else {
                        await redisClient.set(redisKey, 'true');
                    }

                    serverlogs.execute(guild, user.user, `MUTED`, moderator, reason, timeString, client);
                }
            });

        } catch (err) {
            errorhandler.init(err, __filename, message);
        }
    },

    unmute: async (user, guild, moderator, client, message) => {

        if (user.user.bot) return errorMessage(`You are not allowed to unmute bots`);
        if (user.hasPermission("ADMINISTRATOR")) return errorMessage(`You aren't allowed to unmute admins`);
        if (user.user.id === moderator.id) return errorMessage(`You aren't allowed to unmute yourself`);

        function errorMessage(problem) {
            if (!message) return;

            message.channel.send(
                new Discord.MessageEmbed()
                .setDescription(`${nopeEmoji} ${problem}`)
                .setColor("FF3E3E")
            )
        }

        let settings = client.settings.get(guild.id);

        let muteRole = (
            guild.roles.cache.get(settings.muteRole) ||
            guild.roles.cache.find((role) => role.name === "Muted") ||
            guild.roles.cache.find((role) => role.name === "muted")
        )

        const roleID = client.settings.get(guild.id).muteRole;
        if (roleID) muteRole = guild.roles.cache.get(roleID);
        
        let checkPerms = checkpunishability(message.guild, muteRole);
        if (muteRole) if (checkPerms) return message.channel.send(checkPerms);

        const redisClient = await database.redisClient;
        try {
            const redisKey = `muted-${user.id}-${guild.id}`;

            await redisClient.get(redisKey, async (err, result) => {

                if (err) return errorhandler.init(err, __filename);

                let getRole;
                if (muteRole) getRole = user.roles.cache.get(muteRole.id);

                if ((!getRole) && (!result)) return errorMessage(`You cannot unmute someone that is not muted`);
                else await muteDataRemove();


                async function muteDataRemove() {

                    if (getRole) user.roles.remove(muteRole, 'Unmuted member');
                    if (result) await redisClient.del(redisKey);

                    serverlogs.execute(guild, user.user, 'UNMUTED', moderator, null, null, client);

                    if (message) message.channel.send(
                        new Discord.MessageEmbed()
                        .setDescription(`${checkEmoji} ${user} has been unmuted`)
                        .setColor("33FF5B")
                    )
                }

            });

        } catch (err) {
            errorhandler.init(err, __filename, message);
        }
    },

    expireManager: (client) => {
        expire(message => {
            if (!message.startsWith(`muted-`)) return;
            const muteData = message.split('-');

            const memberID = muteData[1];
            const guildID = muteData[2];

            const guild = client.guilds.cache.get(guildID);
            const member = guild.members.cache.get(memberID);

            serverlogs.execute(guild, member.user, 'UNMUTED', client.user, null, null, client);

            const roleID = client.settings.get(guild.id).muteRole;
            if (!roleID) return;

            const settings = client.settings.get(guild.id);

            const muteRole = (
                guild.roles.cache.get(settings.muteRole) ||
                guild.roles.cache.find((role) => role.name === "Muted") ||
                guild.roles.cache.find((role) => role.name === "muted")
            )
            if (!muteRole) return;

            member.roles.remove(muteRole, 'Unmuted member');
        })
    }
}