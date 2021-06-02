const url = require("url");
const path = require("path");
const express = require("express");
const passport = require("passport");
const Strategy = require("passport-discord").Strategy;
const settings = require("./settings");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const Discord = require("discord.js");
const guildData = require("../models/guildData");
const spacetime = require('spacetime');
const dashboard = require("./routes/dashboard");
const mongoose = require('mongoose');
const botInfo = require("../models/botInfo");
const app = express();
const database = require('../database');
const redis = require('redis');
const refresh = require('passport-oauth2-refresh');
const session = require('express-session');
const {
  getUserGuilds
} = require("./utils/api");
const {
  encrypt
} = require("./utils/utils");
let RedisStore = require('connect-redis')(session);
const config = require('./utils/config');
const {
  checkAuth,
  renderTemplate
} = require("./utils/auth");

/**
 * 
 * @param {Discord.ShardingManager} manager
 */

const {
  dataDir,
  templateDir
} = config;

const redisClient = redis.createClient({
  url: config.redisPath
})
database.mongoose();

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

var callbackUrl;
var domain;

try {
  const domainUrl = new URL(config.domain);
  domain = {
    host: domainUrl.hostname,
    protocol: domainUrl.protocol
  };
} catch (e) {
  console.log(e);
  throw new TypeError("Invalid domain specific in the config file.");
}

if (config.usingCustomDomain) {
  callbackUrl = `${domain.protocol}//${domain.host}/callback`
} else {
  callbackUrl = `${domain.protocol}//${domain.host}${config.port == 80 ? "" : `:${config.port}`}/callback`;
}

const DiscordStatergy = new Strategy({
    clientID: config.id,
    clientSecret: config.clientSecret,
    callbackURL: callbackUrl,
    scope: ["identify", "guilds", "email"]
  },
  (accessToken, refreshToken, user, done) => {
    let {
      id,
      username,
      tag,
      discriminator,
      avatar,
      email
    } = user;

    let profile = {
      accessToken: encrypt(accessToken),
      id,
      username,
      tag,
      discriminator,
      avatar,
      email
    }
    process.nextTick(() => done(null, profile));
  })

passport.use(DiscordStatergy);
refresh.use(DiscordStatergy);

app.use(session({
  store: new RedisStore({
    client: redisClient
  }),
  name: 'sessionID',
  secret: "Q*XH!@dcW6zTfNHd69q5C@pFqtRuRp6&nJ^g-2@_FMXhBAvM4q^7G#zkuz%Q",
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.engine("html", ejs.renderFile);
app.set("view engine", "html");
app.set('views', templateDir);
app.use("/", express.static(path.resolve(`${dataDir}${path.sep}assets`)));

app.locals.domain = config.domain.split("//")[1];

app.get("/login", (req, res, next) => {
    if (req.session.backURL) {
      req.session.backURL = req.session.backURL;

    } else if (req.headers.referer) {
      const parsed = url.parse(req.headers.referer);
      if (parsed.hostname === app.locals.domain) {
        req.session.backURL = parsed.path;
      }
    } else {
      req.session.backURL = "/";
    }
    next();
  },
  passport.authenticate("discord"));

app.get("/callback", passport.authenticate("discord", {
  failureRedirect: "/",
  successRedirect: '/dashboard'
}), (req, res) => {
  if (req.session.backURL) {
    const url = req.session.backURL;
    req.session.backURL = null;
    res.redirect(url);
  } else {
    res.redirect("/");
  }
});

app.get("/logout", function (req, res) {
  req.session.destroy(() => {
    req.logout();
    res.redirect("/");
  });
});

// Index endpoint.
app.get("/", (req, res) => {
  renderTemplate(res, req, "index.ejs");
});

app.use("/dashboard", dashboard);

app.get("/invite", (req, res) => {
  res.redirect('https://discord.com/api/oauth2/authorize?client_id=781293073052991569&permissions=1916267615&redirect_uri=http%3A%2F%2Flocalhost%3A3001%2Fapi%2Fauth%2Fdiscord%2Fredirect&scope=bot')
})
app.get("/vote", (req, res) => {
  res.redirect('https://top.gg/bot/781293073052991569/vote')
})
app.get("/support", (req, res) => {
  res.redirect('https://discord.gg/5jaZRYnZU5')
})
app.get("/commands", (req, res) => {
  renderTemplate(res, req, "commands.ejs", {
    commands: settings.commands
  });
})

app.get('*', (req, res) => {
  res.status(404);
  renderTemplate(res, req, "404.ejs");
});

app.listen(config.port, null, null, () => console.log(`\n[${spacetime.now(`Africa/Johannesburg`).time()} ${spacetime.now(`Africa/Johannesburg`).format('YYYY-MM-DD')}]: Web processes running on port ${config.port}\n`));