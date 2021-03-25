const ytdl = require('ytdl-core');
const Discord = require('discord.js');
const checkQueue = require('./checkQueue');

module.exports = (client, song, queue, message) => {
    try {

        let guild = message.guild;
        let VC = message.member.voice.channel;

        if ((client.voice.connections.first() === (undefined || null)) || (!client.connection) || (!client.connections.get(guild.id).connection) || (!client.voice.connections.get(client.connection.get(guild.id).connection))) {
            VC.join().then(async connection => {
                connection.voice.setSelfDeaf(true);
                connection.setMaxListeners(0);
        
                client.connections.set(guild.id, { connection });

                play();
            })
        }

        async function play() {
            let options = {
                volume: client.musicOptions.volume,
                highWaterMark: 100,
                fec: true,
                plp: 30,
                bitrate: 64,
                seek: 0,
            }

            if (song.time) options.seek = Math.floor(song.time / 1000), console.log(Math.floor(song.time / 1000));

            let connection = client.connections.get(guild.id).connection;

            let audio = await ytdl(song.url, { quality: 'highestaudio' });

            console.log(song);

            let player = connection.play(audio, options);

            client.currentlyPlaying = song;
            
            if (!song.idle) {
                if (song.time) addedTime = Math.floor(song.time / 1000);
                else addedTime = 0;

                console.log(addedTime)

                client.savedCurrent = {
                    title: song.title,
                    url: song.url,
                    user: song.user,
                    time: player.streamTime + addedTime,
                }

                setInterval(() => {
                    if (client.currentlyPlaying.url === song.url) {
                        client.savedCurrent = {
                            title: song.title,
                            url: song.url,
                            user: song.user,
                            time: player.streamTime + addedTime,
                        }
                    }
                    
                }, 2000);
            }

            player.on('finish', () => {
                client.currentlyPlaying = false;
                client.savedCurrent = false;
                checkQueue.run(client);
            })
        }
            
        } catch(err) {
            console.log(err);
        }
}