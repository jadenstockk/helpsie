const Discord = require('discord.js');
const errHandler = require('../errorhandler');

module.exports = {
    init: (client) => {
        
        client.on("messageReactionAdd", async (reaction, user, message, channel) => {
            try {

            } catch (err) {
                errHandler.init(err, __filename);

            }
          }); 
    }
}