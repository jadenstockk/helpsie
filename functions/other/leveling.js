const errorhandler = require("../../errorhandler");
const userData = require("../../models/userData");

module.exports = {
    name: 'leveling',
    description: 'increase member xp for sending messages',

    execute(message, args, client) {
        if (client.levelingTimeouts.has(`${message.author.id}  | ${message.guild.id}`)) return;
        if (allCommands.includes(args[0].replace(client.settings.get(message.guild.id).prefix, '')) && message.content.startsWith(client.settings.get(message.guild.id).prefix)) return;
        if (client.blacklistedUsers && client.blacklistedUsers.find(person => person.user === message.author.id)) return;

        let max = 25;
        let min = 15;
        let randomXP = Math.floor(Math.random() * (max - min) + min);

        addXP(message.guild.id, message.author.id, randomXP, message, client);

        client.levelingTimeouts.add(`${message.author.id}  | ${message.guild.id}`)

        setTimeout(() => {
            client.levelingTimeouts.delete(`${message.author.id}  | ${message.guild.id}`)

        }, 60000);
    }
}

const addXP = async (guild, user, addedXP, message, client) => {
    return;
    const result = await userData.findOneAndUpdate({
        guild,
        user,
    }, {
        guild,
        user,
        $inc: {
            xp: addedXP,
            totalxp: addedXP,
        }
    }, {
        upsert: true,
        new: true,
    })

    let USER = message.guild.members.cache.get(user).user;

    let {
        xp,
        level
    } = result;
    const needed = getRequiredXP(level);

    if (xp >= needed) {
        while (xp >= needed) {
            ++level
            xp = xp - needed
        }

        await userData.updateOne({
            guild,
            user,
        }, {
            level,
            xp,
        })

        let levelingSettings = client.settings.get(message.guild.id).leveling;
        let levelroles = levelingSettings.roles;
        levelroles.sort(function (a, b) {
            return a.level - b.level
        });

        try {
            levelroles.forEach((levelrole, index) => {
                if (level >= levelrole.level) {
                    let rolesToAdd = levelroles.slice(0, index + 1);
                    rolesToAdd.forEach(role => {
                        message.guild.members.cache.get(user).roles.add(role.role);
                    })
                }
            })

        } catch (err) {
            errorhandler.init(err, __filename);

        }

        let channel = message.guild.channels.cache.get(levelingSettings.channel);
        if (!channel) channel = message.channel;

        channel.send(levelingSettings.message.replace('{level}', level).replace('{user}', USER));
    }
}

const removeXP = async (guild, user, addedXP, message, client) => {
    const result = await userData.findOneAndUpdate({
        guild,
        user,
    }, {
        guild,
        user,
        $inc: {
            xp: addedXP,
            totalxp: addedXP,
        }
    }, {
        upsert: true,
        new: true,
    })

    let USER = message.guild.members.cache.get(user).user;

    let {
        xp,
        level,
        totalxp
    } = result;

    if (xp < 0) {
        let excess = xp * -1;
        totalxp -= excess;

        while (xp < 0) {
            excess = xp * -1;

            --level
            xp = getRequiredXP(level) - excess;
        }
    }

    if (totalxp < 1) {
        await userData.updateOne({
            guild,
            user,
        }, {
            $unset: {
                level,
                xp,
                totalxp,
            }
        })

    } else {
        await userData.updateOne({
            guild,
            user,
        }, {
            level,
            xp,
            totalxp,
        })
    }
}

const resetXP = async (guild, user, message, client) => {
    const result = await userData.findOneAndUpdate({
        guild,
        user,
    }, {
        guild,
        user,
        totalxp: 0,
        level: 0,
        xp: 0,

    }, {
        upsert: true,
        new: true,
    })
}

function getRequiredXP(level) {

    requiredXP = 100;
    xpAdd = 55;

    for (var i = 0; i < level; i++) {
        requiredXP = requiredXP + xpAdd;
        xpAdd = xpAdd + 10;

    }
    return requiredXP - 100;
}

function getLevel(xp) {

    requiredXP = 100;
    xpAdd = 55;

    for (var i = 0; i < xp; i++) {
        requiredXP = requiredXP - xpAdd;
        xpAdd = xpAdd + 10;

    }
    return requiredXP;
}

module.exports.addXP = addXP
module.exports.removeXP = removeXP
module.exports.resetXP = resetXP