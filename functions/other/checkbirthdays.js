module.exports = {
    name: 'birthday',
    description: 'wish them happy birthdayyy',

    async execute(client) {
        const Discord = require('discord.js');
        const userData = require('../../models/userData');
        const spacetime = require('spacetime');

        let now = spacetime.now();
        let channel = client.guilds.cache.get('721065682401493002').channels.cache.get('808331343868067860');
        let general = client.guilds.cache.get('721065682401493002').channels.cache.get('727990054026346496');

        userData.find(
            { bDate: `${now.month() + 1}/${now.date()}` },
            async (err, data) => {
              if (err) console.log(err);
              if (!data) {
                  return;

              } else {
                  data.forEach(async member => {
                      if (member.bWished.includes(`${now.year()}`)) return;

                      let user = client.users.cache.get(member.user);

                      channel.send(
                          new Discord.MessageEmbed()
                          .setAuthor(`Happy Birthday ${user.tag}`, user.displayAvatarURL())
                          .setDescription(`Today is ${user}'s Birthday! Everyone wish them in ${general}! 🥳`)
                          .setColor('BLUE')
                      )

                      member.bWished.push(`${now.year()}`);
                      await member.save();
                  })
              }
            }
          );
    }
}