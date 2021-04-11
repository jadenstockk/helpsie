const leveling = require("../../functions/other/leveling");

module.exports = {
  commands: 'leaderboard',
  description: `Use this command to get the level leaderboard (containing the top ranked users) of the server`,
  usage: ``,
  group: 'leveling',

  callback: (message, args, client) => {
    const Discord = require("discord.js");
    const shortNum = require('number-shortener');
    const userData = require("../../models/userData");
    const path = require('path');

    async function getLeaderboard() {
      let ranks = await userData.find({
        guild: message.guild.id
      }).sort({
        totalxp: 'desc'
      }).lean();
      ranks.forEach(rank => {
        if (!rank.totalxp || rank.totalxp === 0) ranks.pop(rank);
      })

      let leaderboard = [];
      for (var i = 0; i <= 9; i++) {
        if (ranks[i]) {
          let number = i + 1;
          if (number === 1) number = '🥇';
          else if (number === 2) number = '🥈';
          else if (number === 3) number = '🥉';
          else number = number + '.';

          leaderboard.push(`**${number}** ${client.users.cache.get(ranks[i].user)} | **Level ${ranks[i].level}** | **Progress ${`${shortNum(ranks[i].xp)}`.replace('+','').replace('-', '')}/${`${shortNum(getRequiredXP(ranks[i].level))}`.replace('+','').replace('-', '')}**`)
        }
      }

      if (leaderboard.length < 1) return message.channel.send(new Discord.MessageEmbed().setDescription(`${nopeEmoji} There isn't enough ranking data to show - more members need to type a couple messages for the leaderboard to work`).setColor("#FF3E3E"))

      let embed = new Discord.MessageEmbed()
        .setColor("FFDC2C")
        .setAuthor(message.guild.name + ' Leaderboard', message.guild.iconURL())
        .setDescription(leaderboard.join('\n'))
        .setThumbnail('https://i.ibb.co/XVbpjb2/pngtree-gold-trophy-icon-trophy-icon-winner-icon-png-image-1694365-removebg-preview.png')

      message.channel.send(embed);
    }
    getLeaderboard();
  },
};

function getRequiredXP(level) {

  requiredXP = 100;
  xpAdd = 55;

  for (var i = 0; i < level; i++) {
    requiredXP = requiredXP + xpAdd;
    xpAdd = xpAdd + 10;

  }
  return requiredXP;
}