const config = require("./config");
const path = require('path');
const {
    dataDir,
    templateDir
  } = config;

const renderTemplate = (res, req, template, data = {}) => {
    const baseData = {
        bot: { config },
        botid: config.id,
        path: req.path,
        user: req.isAuthenticated() ? req.user : null
    };
    res.render(path.resolve(`${templateDir}${path.sep}${template}`), Object.assign(baseData, data));
};

const checkAuth = (req, res, next) => {
    if (req.isAuthenticated()) return next();
    req.session.backURL = req.url;
    res.redirect("/login");
}

module.exports = { renderTemplate, checkAuth };