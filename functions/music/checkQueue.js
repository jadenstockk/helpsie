const Discord = require('discord.js');
const queue = require('../../models/musicData');

module.exports = {
    run: (client, message, special) => {
        try {
            queue.findOne({ queueID: client.user.id },
                async (err, data) => {

                    if (special) {
                        if (!data) return outOfSongs();
                        if (!data.queue || data.queue.length === 0) return outOfSongs();

                        if (data.queue.length < 2) displayQueue = undefined;
                        else displayQueue = data.queue;
    
                        client.musicOptions.play(client, data.queue.shift(), displayQueue, message);
                        client.refreshStream = false;
                        data.save();

                    } else if (client.savedCurrent) {
                        if (!data.queue || data.queue.length === 0) return client.musicOptions.play(client, client.savedCurrent);
                    
                        client.musicOptions.play(client, client.savedCurrent, data.queue);
                        client.refreshStream = false;

                    } else if (!data) {
                        outOfSongs();


                } else {

                    if (!data.queue || data.queue.length === 0) return outOfSongs();

                    if (data.queue.length < 2) displayQueue = undefined;
                    else displayQueue = data.queue;

                    client.musicOptions.play(client, data.queue.shift(), displayQueue, message);
                    client.refreshStream = false;
                    data.save();
                }
            })
    
            function outOfSongs() {
                return;
                client.refreshStream = true;
            }
    
    
        } catch(err) {
            console.log(err);
        }
    }
}