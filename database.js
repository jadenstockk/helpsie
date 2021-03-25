const mongoose = require("mongoose");
const redis = require('redis');
const config = require('./config.json');
const errorhandler = require("./errorhandler");
const guildData = require('./models/guildData');

module.exports = {
  init: () => {
    const dbOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      autoIndex: false,
      reconnectTries: Number.MAX_VALUE,
      reconnectInterval: 500,
      poolSize: 5,
      connectTimeoutMS: 10000,
      family: 4,
    };

    mongoose.connect(
      config.database,
      dbOptions
    );
    mongoose.set("useFindAndModify", false);
    mongoose.Promise = global.Promise;

    mongoose.connection.on("connected", () => {
      console.log("Database connected")
    });

    mongoose.connection.on("err", () => {
      console.log(`Database connection error: \n${err.stack}`);
      if (err) console.log(err);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn(`Database connection lost`);
    });
  },

  redis: async () => {

    const client = redis.createClient({
      url: config.redisPath
    })

    client.on('error', (err) => {
      errorhandler.init(err, __filename)
    })

    client.on('ready', () => {
      console.log('Redis connected')
    })

    client.on('reconnecting', () => {
      console.log('Redis reconnecting')
    })

    module.exports.redisClient = client;
  },

  fetchAllGuildData: async (client, connecting) => {
    await guildData.find(
      async (err, data) => {
        if (err) console.log(err), client.console.log(`Problem when loading all guild data\n\n${err}`, 'unsuccess', client);

        await client.guilds.cache.forEach(async guild => {
          let guildData = data.find(one => one.guild === guild.id);

          await dataHandler(guildData, guild.id, client);

          if (connecting) {
            dataFetched++
          }
        })
      }
    );
  },

  fetchGuildData: async (guild, client, connecting) => {
    await guildData.findOne(
      { guild },
      async (err, data) => {
        if (err) console.log(err), client.console.log(`Problem when loading guild data\n\n${err}`, 'unsuccess', client);

        dataHandler(data, guild, client);

          if (connecting) {
            dataFetched++
          }
      }
    );
  },

  updateGuildData: (guild, client, section, update) => {
    guildData.findOne(
      { guild: guild},
      async (err, data) => {
        if (err) console.log(err), client.console.log(`Problem when updating guild data\n\n\`\`\`${err}\`\`\``, 'unsuccess', client);

        function dataUpdate(section, update) {
          if (section === 'prefix') return data.prefix = update;
        
          else if (section === 'profanityFilter') return data.profanityFilter = update;
          else if (section === 'inviteBlocker') return data.inviteBlocker = update;
          else if (section === 'linkBlocker') return data.linkBlocker = update;
        
          else if (section === 'modRole') return data.modRole = update;
          else if (section === 'muteRole') return data.muteRole = update;
        
          else if (section === 'disabled') return data.disabled = update;
        
          else if (section === 'levels') return data.levels = update;
          else if (section === 'leveling') return data.leveling = update;
        
          else if (section === 'welcomeChannel') return data.welcome.channel = update;
          else if (section === 'welcomeMessage') return data.welcome.channel = update;
          else if (section === 'welcomeRole') return data.welcome.channel = update;

          else if (section === 'reactionRoles') return data.reactionRoles = update;
        
          else if (section === 'logsChannel') return data.logsChannel = update;
          
          else if (section === 'warns') return data.warns = update;
        }

        if (!data) {
          let newData = new guildData({
            guild: message.guild.id,

          });
          newData.save();

          dataUpdate(section, update);
          data.save();

        } else {
          dataUpdate(section, update);
          data.save();

        }
        client.database.fetchGuildData(guild, client);
      }
    );
  }
};

module.exports.expire = (callback) => {
    const expired = () => {
      const sub = redis.createClient({ url: config.redisPath })
      sub.subscribe('__keyevent@0__:expired', () => {
        sub.on('message', (channel, message) => {
          callback(message)
        })
      })

      sub.on('error', (err) => {
        errorhandler.init(err, __filename);
      })
    }
  
    const pub = redis.createClient({ url: config.redisPath })
    pub.send_command('config', ['set', 'notify-keyspace-events', 'Ex'], expired())

    pub.on('error', (err) => {
      errorhandler.init(err, __filename);
    })
}

async function dataHandler(data, guild, client) {
  if (data) {
    if (!data.prefix) prefix = '!';
    else prefix = data.prefix;

    if (!data.profanityFilter) profanityFilter = 'off';
    else profanityFilter = data.profanityFilter;
    if (!data.inviteBlocker) inviteBlocker = 'off';
    else inviteBlocker = data.inviteBlocker;
    if (!data.linkBlocker) linkBlocker = 'off';
    else linkBlocker = data.linkBlocker;
    
    if (!data.disabled) disabled = [];
    else disabled = data.disabled;

    modRole = data.modRole;
    muteRole = data.muteRole;

    if (!data.welcome) welcome = { channel: undefined, message: undefined, role: undefined };
    else welcome = data.welcome;

    if (!data.leveling) leveling = { channel: undefined, message: `**Well done {user} you just reached level {level}!** 🥳`, roles: [] };
    else leveling = data.leveling;

    if (!data.reactionRoles) reactionRoles = [];
    else reactionRoles = data.reactionRoles;

    if ((!data.autoModActions )|| (data.autoModActions === [])) autoModActions = [];
    else autoModActions = data.autoModActions;

    if (!data.logsChannel) logsChannel = { token: undefined, id: undefined, channelID: undefined };
    else logsChannel = data.logsChannel;

    await client.settings.set(guild, {

      prefix,
      profanityFilter,
      inviteBlocker,
      linkBlocker,
      disabled,
      modRole,
      welcome,
      logsChannel,
      muteRole,
      reactionRoles,
      leveling,
      autoModActions

    });

  } else {

    await client.settings.set(guild, {

      prefix: '!',
      profanityFilter: 'off',
      inviteBlocker: 'off',
      linkBlocker: 'off',
      disabled: [],
      modRole: undefined,
      welcome: { channel: undefined, message: undefined, role: undefined },
      logsChannel: { token: undefined, id: undefined, channelID: undefined }, 
      muteRole: undefined,
      reactionRoles: [],
      leveling: { channel: undefined, message: `**Well done {user} you just reached level {level}!** 🥳`, roles: [] },
      autoModActions: []

    });
  }
}