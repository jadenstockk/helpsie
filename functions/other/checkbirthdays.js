module.exports = {
    name: 'checkbirthdays',
    description: 'wish them happy birthdayyy',

    async execute(client) {
        const Discord = require('discord.js');
        const userData = require('../../models/userData');
        const spacetime = require('spacetime');

        let now = spacetime.now();

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
                      let settings = client.settings.get(member.guild).birthdays;
                      let channel = settings.channel;
                      let message = settings.message;
                      if (!settings || !channel || !message) return;

                      channel = client.channels.cache.get(channel);
                      if (!channel) return;

                      channel.send(
                          user,
                          
                          new Discord.MessageEmbed()
                          .setAuthor(`Happy Birthday ${user.tag}`, user.displayAvatarURL())
                          .setDescription(message.replace('{user}', user))
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