module.exports = {
  commands: 'setbirthday',
  permissions: 'ADMINISTRATOR',
  permissionError: `You have to be an administrator to use this command`,
  permissionMessage: true,
  description: `Use this command to set someone else's birthday`,
  usage: `<member> <date>`,

  callback: (message, args, client) => {
    const Discord = require("discord.js");
    const spacetime = require('spacetime');
    const userData = require('../../models/userData');

    let user = message.mentions.users.first() || client.users.cache.get(args[0]);
    if (!user) return message.channel.send(
      new Discord.MessageEmbed()
      .setDescription(`${nopeEmoji} Please mention a valid member who's birthday you want to set`)
      .setColor("#FF3E3E")
    )
    if (user.bot) return message.channel.send(
      new Discord.MessageEmbed()
      .setDescription(`${nopeEmoji} Unfortunately bots do not have birthdays`)
      .setColor("#FF3E3E")
    )

    let input = args.slice(1).join(' ');
    let birthday = spacetime(input);
    if (birthday)
      if (spacetime.now().since(birthday).precise.endsWith('ago')) birthday = birthday.add(1, 'year');
    if (!input || !birthday || birthday.epoch === null || spacetime.now().since(birthday).precise.endsWith('ago')) return message.channel.send(
      new Discord.MessageEmbed()
      .setDescription(`${nopeEmoji} You did not specify a valid date\n\n**Type the date as follows:**\n\`MONTH-DAY\` e.g. 08-31`)
      .setColor("#FF3E3E")
    )

    let localDate = birthday.toLocalDate();
    let newDate = (localDate.getMonth() + 1) + '/' + localDate.getDate();
    let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    userData.findOne({
        user: user.id,
        guild: message.guild.id
      },
      async (err, data) => {
        if (err) console.log(err);
        if (!data) {
          let newData = new userData({
            user: user.id,
            guild: message.guild.id,
            bDate: newDate,
            bWished: [],
          })
          await newData.save();

          return message.channel.send(
            new Discord.MessageEmbed()
            .setDescription(`${checkEmoji} Successfully added ${user}'s next birthday in **${spacetime.now().since(birthday).precise}** on **${localDate.getDate()} ${months[localDate.getMonth()]} ${localDate.getFullYear()}**`)
            .setColor("#00FF7F")
          )

        } else {

          if (newDate === data.bDate) return message.channel.send(
            new Discord.MessageEmbed()
            .setDescription(`${nopeEmoji} ${user}'s birthday is already set to: **${localDate.getDate()} ${months[localDate.getMonth()]} ${localDate.getFullYear()}**`)
            .setColor("#FF3E3E")
          )

          data.bDate = newDate;
          data.bWished = [];
          await data.save();

          return message.channel.send(
            new Discord.MessageEmbed()
            .setDescription(`${checkEmoji} Successfully added ${user}'s next birthday in **${spacetime.now().since(birthday).precise}** on **${localDate.getDate()} ${months[localDate.getMonth()]} ${localDate.getFullYear()}**`)
            .setColor("#00FF7F")
          )
        }
      }
    );
  }
};