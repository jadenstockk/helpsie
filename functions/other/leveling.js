const userData = require("../../models/userData");

module.exports = {
    name: 'leveling',
    description: 'increase member xp for sending messages',

    execute(message, args, client) {
        for (i in allCommands) if (message.content.startsWith(`${client.settings.get(message.guild.id).prefix}${allCommands[i]}`)) return;
        if (message.content === '') return;
        if (client.levelingTimeouts.has(`${message.author.id}  | ${message.guild.id}`)) return;
        if (client.blacklistedUsers && client.blacklistedUsers.find(person => person.user === message.author.id)) return;

        let max = 25;
        let min = 15;
        let randomXP = Math.floor(Math.random() * (max - min) + min);

        addXP(message.guild.id, message.author.id, randomXP, message, client);

        client.levelingTimeouts.add(`${message.author.id}  | ${message.guild.id}`)

        setInterval(() => {
            client.levelingTimeouts.delete(`${message.author.id}  | ${message.guild.id}`)
            
        }, 60000);
    }
}

const addXP = async(guild, user, addedXP, message, client) => {
    const result = await userData.findOneAndUpdate(
        {
            guild,
            user,
        },
        {
            guild,
            user,
            $inc: {
                xp: addedXP,
                totalxp: addedXP,
            }
        }, {
            upsert: true,
            new: true,
        }
    )

    let USER = message.guild.members.cache.get(user).user;

    let { xp, level } = result;
    const needed = getRequiredXP(level);

    if (xp >= needed ) {
        while (xp >= needed) {
            ++level
            xp -= needed
        }

        await userData.updateOne({
            guild,
            user,
        },
        {
            level,
            xp,
        })

        let levelingSettings = client.settings.get(message.guild.id).leveling;

        let channel = message.guild.channels.cache.get(levelingSettings.channel);
        if (!channel) channel = message.channel;

        channel.send(levelingSettings.message.replace('{level}', level).replace('{user}', USER));
    }
}

const removeXP = async(guild, user, addedXP, message, client) => {
    const result = await userData.findOneAndUpdate(
        {
            guild,
            user,
        },
        {
            guild,
            user,
            $inc: {
                xp: addedXP,
                totalxp: addedXP,
            }
        }, {
            upsert: true,
            new: true,
        }
    )

    let USER = message.guild.members.cache.get(user).user;

    let { xp, level, totalxp } = result;

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
        },
        {
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
        },
        {
            level,
            xp,
            totalxp,
        })
    }
}

const resetXP = async(guild, user, message, client) => {
    const result = await userData.findOneAndUpdate(
        {
            guild,
            user,
        },
        {
            guild,
            user,
            xp: 0,
            $unset: {
                totalxp,
                level,
                xp,
            }
        }, {
            upsert: true,
            new: true,
        }
    )
}

function getRequiredXP(level) {

      requiredXP = 100;
      xpAdd = 55;

      for (var i = 0; i < level; i++) {
          requiredXP = requiredXP + xpAdd;
          xpAdd = xpAdd + 10;

      }
      return requiredXP;
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