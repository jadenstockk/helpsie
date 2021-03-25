const checkQueue = require('../../functions/music/checkQueue');
const ytdl = require('ytdl-core');

module.exports = {
    commands: ['play', 'p'],

    callback: async (message, args, client) => {
        const search = require("youtube-search");
        const queue = require('../../models/musicData');
        const Discord = require('discord.js');
        const decoder = require('html-encoder-decoder');

        try {
            const opts = {
                maxResults: 2,
                key: client.musicOptions.searchAPI,
                type: 'video'
            };
      
            let query = args.slice(0).join(' ');
            if (!query) return checkQueue.run(client, message)
      
            let results = await search(query, opts).catch(err => {
                return message.channel.send(
                    new Discord.MessageEmbed()
                    .setAuthor(`There was a problem when searching for your song`, 'https://i.ibb.co/h25ZHjQ/Playlist.png')
                    .setColor("RED")
                )
            })
      
            if (!results || results.pageInfo.totalResults === 0) return message.channel.send(
                new Discord.MessageEmbed()
                .setAuthor(`No results found for ${query}`, 'https://i.ibb.co/h25ZHjQ/Playlist.png')
                .setColor("RED")
            );
            
            if (results) {

                findValidSong(0);

                async function findValidSong(number) {
                    
                    let youtubeResults = results.results[number];

                    if (await ytdl.validateURL(youtubeResults.link) === false) return findValidSong(number + 1);

                    // let duration = await new getDuration(client.musicOptions.searchAPI).getVideo(youtubeResults.link).durationSeconds;

                    let song = {
                        title: decoder.decode(youtubeResults.title),
                        url: youtubeResults.link,
                        user: message.author.id,
                        //duration: Math.floor(parseInt(duration) / 1000),
                    }
      
                    queue.findOne({ queueID: client.user.id },
                      async (err, data) => {
                          if (!data) {
                              let newQueue = new queue({
                                  queueID: client.user.id,
                                  queue: [song],
                              })
                              await newQueue.save();

                              data = newQueue;
          
                      } else {
                          if (!data.queue) data.queue = [song];
                          else data.queue.push(song);
      
                          await data.save();
                      }
      
                      message.channel.send(
                          new Discord.MessageEmbed()
                          .setAuthor(`${song.title} added to queue`, 'https://i.ibb.co/h25ZHjQ/Playlist.png')
                          .setColor("#059DFF")
                      )
      
                      if (!client.currentlyPlaying) {
                          checkQueue.run(client, message);
                      }
                  })
            }
        }

        } catch(err) {
            console.log(err);
            
        }
    }
}