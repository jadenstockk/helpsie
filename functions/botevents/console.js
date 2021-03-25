const Discord = require('discord.js');

module.exports = {
    log: (message, type, client) => {

        if (type === 'success') emoji = '🟢';
        if (type === 'unsuccess') emoji = '🔴';

        client.guilds.cache.get('794565558862479360').channels.cache.get('797113522580094986').send(
            `\`${emoji} ${message}\``
        )
    }
}