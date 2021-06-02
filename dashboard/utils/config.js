const configMain = require('../../config.json');
const path = require('path');
const dataDir = path.join(__dirname, '../');
require('dotenv').config();

module.exports = {
    "redisPath": configMain.redisPath,
    "token": process.env['TOKEN'],
    "mongodbUrl": configMain.database,
    "id": process.env['ID'],
    "clientSecret": process.env['CLIENT_SECRET'],
    "domain": process.env['DOMAIN'],
    "port": process.env['PORT'],
    "usingCustomDomain": process.env['CUSTOM_DOMAIN'],
    "dataDir": dataDir,
    "templateDir": path.resolve(`${dataDir}${path.sep}templates`)
};