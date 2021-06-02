const express = require('express');
const Discord = require('discord.js');
const {
    fetchGuildData,
    fetchAndReturnGuildData
  } = require("../../database");
const config = require('../utils/config');
const database = require('../../database');
const { getUserGuilds, getBotGuilds } = require('../utils/api');
const { renderTemplate, checkAuth } = require('../utils/auth');
const { getMutualGuilds } = require('../utils/utils');
let router = express.Router();

router.get("/", checkAuth, async (req, res) => {
    const userguilds = await getUserGuilds(req.user.accessToken);
    const botguilds = await getBotGuilds();

    const {
        included,
        excluded
    } = await getMutualGuilds(userguilds, botguilds);

    renderTemplate(res, req, "dashboard.ejs", {
        included,
        excluded
    });
  });

async function editSettings(req, res) {
    let guilds = await getUserGuilds(req.user.accessToken);

    if (!hasPerms) return res.redirect("/dashboard");
    const data = {
        guild: guild || null,
        current: await fetchAndReturnGuildData(guildID, manager) || null
    }
    if (!data.guild) return res.redirect("/dashboard");
    return data;
}

router.get("/:guildID", checkAuth, async (req, res) => {

    let returned = await editSettings(req, res);
    if (!returned) return;

    let {
        guild,
        current
    } = returned;

    renderTemplate(res, req, "dash-menu.ejs", {
        guild,
        current,
        info: require('../../functions/other/settingsdata/settings.json'),
        alert: null
    });
});

router.post("/:guildID", checkAuth, async (req, res) => {

    let returned = await editSettings(req, res);
    if (!returned) return;

    let {
        guild
    } = returned;

    let data = await guildData.findOne({
        guild: guild.id
    });
    if (!data) {
        data = new guildData({
            guild: guild.id
        });
    }

    let {
        prefix,
        profanityFilter,
        inviteBlocker,
        linkBlocker,
        tips

    } = req.body;

    console.log(req.body);

    if (prefix) data.prefix = prefix;
    if (profanityFilter) data.profanityFilter = profanityFilter;
    if (inviteBlocker) data.inviteBlocker = inviteBlocker;
    if (linkBlocker) data.linkBlocker = linkBlocker;
    if (tips) data.tips = true;
    else if (!tips) data.tips = false;


    await data.save().catch(() => {});
    await manager.broadcastEval(`
    if (this.guilds.cache.get('${guild.id}')) this.database.fetchGuildData('${guild.id}', this, false);
  `)
        .catch(err => {
            console.log(err)
        })

    let current = await fetchAndReturnGuildData(guild.id, manager);

    renderTemplate(res, req, "dash-menu.ejs", {
        guild,
        current,
        info: require('../functions/other/settingsdata/settings.json'),
        alert: "Settings successfully updated"
    });
});

module.exports = router;