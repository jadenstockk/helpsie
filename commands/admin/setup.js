const Discord = require("discord.js");
const settings = require("../../functions/other/settings");

module.exports = {
  commands: 'setup',
  permissions: 'ADMINISTRATOR',
  permissionMessage: true,
  description: `Use this command to setup the bot`,
  usage: ``,

  callback: (message, args, client) => {

    const { channel } = message;

    let step = 0;
    let steps = [
      {
        c: 'prefix',
        d: `What do you want the server's prefix to be? The server's prefix is the symbol, letter or combination of the two that is used to trigger the bot. For example, if you were to type \`!help\`, the prefix would be \`!\``
      },
      {
        c: 'logs',
        d: ''
      },
      {
        c: 'moderator',
        d: ''
      },
      {
        c: 'muted',
        d: ''
      },
      {
        c: 'profanityfilter',
        d: ''
      },
      {
        c: 'inviteblocker',
        d: ''
      },
      {
        c: 'linkblocker',
        d: ''
      },
      {
        c: 'actions',
        d: ''
      },
      {
        c: 'welcomechannel',
        d: ''
      },
      {
        c: 'welcomemessage',
        d: ''
      },
      {
        c: 'welcomerole',
        d: ''
      },
      {
        c: 'levelchannel',
        d: ''
      },
      {
        c: 'levelmessage',
        d: ''
      },
      {
        c: 'levelroles',
        d: ''
      },
      {
        c: 'birthdaychannel',
        d: ''
      },
      {
        c: 'birthdaymessage',
        d: ''
      },
      {
        c: 'birthdayrole',
        d: ''
      },
    ];

    function error(problem) {
      return channel.send(new Discord.MessageEmbed()
        .setDescription(`${nopeEmoji} ${problem}`)
        .setColor("#FF3E3E"))
    }

    function embed(description) {
      channel.send(
        new Discord.MessageEmbed()
        .setColor(process.env['EMBED_COLOR'])
        .setAuthor(`${client.user.username} Setup | Step ${step + 1}/${steps.length}`, client.user.displayAvatarURL())
        .setDescription(description)
        .setFooter(`Type "skip" to leave this step out and move on or type "cancel" to end the setup process`)
      )
    }

    channel.send(
      new Discord.MessageEmbed()
      .setColor(process.env['EMBED_COLOR'])
      .setAuthor(`${client.user.username} Setup Process`, client.user.displayAvatarURL())
      .setDescription(`Welcome to ${client.user.username}'s setup process. This makes it easier for you to customize ${client.user.username} to your liking rather than having to type out long settings commands.\n\nWant to **skip** a **certain step** of the setup process? No problem, just **type \`skip\`** to move onto the **next step**!\n\nStarting to feel as though you **don't** really want to carry on with the **setup process**? No problem, just **type \`cancel\`**!\n\nNow that you've been briefed on what to expect, let's get started on the setup process!\n\n**Type \`start\` to begin**`)
      .setFooter(`Want to get straight into the commands? Type ${prefix}help for a list of commands`)

    )

    channel.awaitMessages(m => m.author.id === message.author.id, {

      max: 1,
      time: 90000

    }).then(async collected => {

      let input = collected.first().content.toLowerCase();

      if (input === 'start') {
        processManager();

      }

    }).catch(() => {
      error(`**${client.user.username} Setup Process** timed out due to no input from the user`);
    })

    async function processManager() {
      embed(steps[step].d);

      channel.awaitMessages(m => m.author.id === message.author.id, {

        max: 1,
        time: 90000
  
      }).then(async collected => {
  
        let input = collected.first().content.toLowerCase();
  
        if (input === 'skip' || input === 'next') {
  
        } else if (input === 'cancel' || input === 'end') {
  
        } else {
          let currentSettings = client.settings.get(message.guild.id);
          let setting = steps[step].c;
          let settinginfo = args[1];

          settings.execute(message, args, client, setting, settinginfo, currentSettings);
  
        }
      }).catch(() => {
        error(`**${client.user.username} Setup Process** timed out due to no input from the user`);
      })
    }
  }
};