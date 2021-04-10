const Discord = require("discord.js");
const path = require('path');
const client = new Discord.Client({
  partials: ["MESSAGE", "CHANNEL", "REACTION"]
});
const config = require('./config.json');
const voting = require('./events/botPagesVoting');
const fs = require("fs");
const guildData = require('./models/guildData');
const botInfo = require("./models/botInfo");
const mute = require("./functions/moderation/mute");
const dotenv = require('dotenv');
dotenv.config();
const {
  DiscordInteractions,
  ApplicationCommandOptionType
} = require("slash-commands");
const slash = require('slash-commands');
const {
  fetchAllGuildData
} = require("./database");
const betaOnline = require("./betaOnline");
const checkbirthdays = require("./functions/other/checkbirthdays");
const supportBot = require("./supportBot");
const pushUpdates = require("./pushUpdates");
client.setMaxListeners(0);
client.database = require("./database");
client.cache = new Set();

const interaction = new DiscordInteractions({
  applicationId: config.appID,
  authToken: process.env['TOKEN'],
  publicKey: config.publicKey,
});

const command = {
  name: "ping",
  description: "Get the bot's current API and client latency as well as uptime",
};

async function slashCmds() {
  await interaction
    //.getApplicationCommands('794565558862479360')
    //.deleteApplicationCommand('826856166273056768', '794565558862479360')
    .createApplicationCommand(command, '794565558862479360')
    .then(console.log)
    .catch(console.error);
}

client.console = require("./functions/botevents/console");

client.levelingTimeouts = new Set();
client.addxpTimeouts = new Set();
client.settings = new Map();
client.timeouts = new Map();
client.birthdaysWished = [];
client.commandsRun = 0;

client.disabledCommands = [{
    command: 'removexp',
    reason: 'Instability due to bugs and various other issues'
  },
  {
    command: 'twitch',
    reason: 'Not completed due to issues with the Twitch API'
  }
];

client.functions = new Discord.Collection();
const subdirectories = fs.readdirSync('./functions');
subdirectories.forEach(directory => {
  const funcFiles = fs.readdirSync(`./functions/${directory}`).filter(file => file.endsWith('.js'));

  for (const fcfile of funcFiles) {

    const fccommand = require(`./functions/${directory}/${fcfile}`);
    client.functions.set(fccommand.name, fccommand);
  }
})

function fetchLatestData(guild) {
  return client.settings.get(guild.id);
}

module.exports.fetchLatest = fetchLatestData;

client.once("ready", async () => {

  client.user.setPresence({
    activity: {
      name: process.env['ACTIVITYNAME'],
      type: 'LISTENING'
    }
  });

  global.nopeEmoji = client.emojis.cache.get('794858153694986271');
  global.muteEmoji = client.emojis.cache.get('794859653825691699');
  global.trashEmoji = client.emojis.cache.get('817888791733600286');
  global.warnEmoji = `:warning:`;
  global.checkEmoji = client.emojis.cache.get('796336616494727205');
  global.logo = client.emojis.cache.get('794861368435408917');
  global.dataFetched = 0;
  global.allCommands = [];
  global.allCommandInfos = [];

  fetchAllGuildData(client, true);

  /*
  client.musicOptions = {
    searchAPI: config.youtubeAPI,
    play: require('./functions/music/playSong'),
    volume: 1
  }
  client.connections = new Map();
  */

  loadAll();

  function loadAll() {
    setTimeout(async () => {
      if (dataFetched > (client.guilds.cache.size - 1)) {

        console.log(`Loaded guild data`)

        loadCommands();
        loadEvents();
        let onlineMessage = ` ${client.user.username} is online in ${client.guilds.cache.size} guilds `;

        console.clear(), console.log(`||${'-'.repeat(onlineMessage.length)}||\n||${onlineMessage}||\n||${'-'.repeat(onlineMessage.length)}||\n`) //, client.console.log(`All startup functions completed`, 'success', client);

      } else {
        setTimeout(() => {
          loadAll();

        }, 3000);
      }
    }, 4000);
  }

  function loadCommands() {
    let baseFile = 'commandhandler.js'
    let commandBase = require(`./commands/${baseFile}`)
    const readCommands = (dir) => {
      const files = fs.readdirSync(path.join(__dirname, dir))
      for (const file of files) {
        const stat = fs.lstatSync(path.join(__dirname, dir, file))

        if (stat.isDirectory()) {
          readCommands(path.join(dir, file))
        } else if (file !== baseFile) {
          const option = require(path.join(__dirname, dir, file))
          commandBase(client, option)
        }
      }
    }
    readCommands('commands');

    console.log(`Loaded commands`)
  }

  let users = 0;
  await client.guilds.cache.forEach(guild => {
    users = users + guild.memberCount;
  })
  voting.init(users, client);

  function loadEvents() {
    if (process.env['TOKEN'] === process.env['BETA_TOKEN']) return client.user.setStatus('idle');

    const readCommands = (dir) => {
      const files = fs.readdirSync(path.join(__dirname, dir))
      for (const file of files) {
        eventRun = require(`./events/${file}`)
        eventRun.init(client);
      }
    }
    readCommands('events');
    mute.expireManager(client);
    checkbirthdays.expireManager(client);
    botFunctions();

    console.log(`Loaded events`)
  }
});

//TESTING
client.on('message', async message => {
  if (message.author.bot) return;
  const { guild } = message;
  const args = message.content.split(/[ ]+/)

  if (message.member.roles.cache.get('824641926832848916')) {
    //client.functions.get('leveling').execute(message, args, client);
    //client.functions.get('checkbirthdays').execute(client);
    /*
    function getRequiredXP(level) {

      requiredXP = 100;
      xpAdd = 55;
    
      for (var i = 0; i < level; i++) {
        requiredXP = requiredXP + xpAdd;
        xpAdd = xpAdd + 10;
    
      }
      return requiredXP;
    }

    lol = 0;
    for (var i = 0; i < 46; i++) {
      lol = lol + getRequiredXP(i);
  
    }
    console.log(lol);
    */
  }
})

async function botFunctions() {

  betaOnline();
  supportBot(client);

  //BIRTHDAYS
  setInterval(() => {
    client.functions.get("checkbirthdays").execute(client);

  }, 30000);

  //STATS POSTER
  setInterval(async () => {
    let users = 0;
    await client.guilds.cache.forEach(guild => {
      users = users + guild.memberCount;
    })
    voting.updateServerCount(users, client);

  }, 20 * 60000);

  //STATS UPDATER
  setInterval(async () => {
    let commandsRun = client.commandsRun;
    let guilds = client.guilds.cache.size;
    let users = 0;

    await client.guilds.cache.forEach(guild => {
      users = users + guild.memberCount;
    })

    botInfo.findOne({
        mainID: 1
      },
      async (err, data) => {
        if (err) return;

        if (!data) {
          let newData = new botInfo({
            mainID: 1,
            commandsRun: commandsRun,
            users: users,
            guilds: guilds,

          })
          await newData.save();

        } else {
          data.commandsRun = data.commandsRun + commandsRun;
          data.users = users;
          data.guilds = guilds;
          await data.save();

        }
        client.commandsRun = 0;
      }
    )

  }, 100000);
}

client.database.redis();
client.database.mongoose();
client.login(process.env['TOKEN']);