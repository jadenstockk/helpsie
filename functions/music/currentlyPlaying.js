const Discord = require('discord.js');

module.exports = {
    update: (client, queue) => {
        try {

            /*

            if (!client.currentlyPlaying) currentlyPlaying = client.musicOptions.mainSong;
            else currentlyPlaying = client.currentlyPlaying;

            let channel = client.channels.cache.get(client.musicOptions.playingChannel);
            if (!channel) return;

            let message = client.musicOptions.playingMessage;
            if (!message) return;

            let title = '';
            let finalQueue = 'No songs queued up next';

            if (queue) shortQueue = [], queue.forEach(song => {
                shortQueue.push(`[${song.title}](${song.url}) **[${client.users.cache.get(song.user)}]**`)
            }), finalQueue = shortQueue.join('\n'), title = ` | ${queue.length} Songs Queued`;
            
            channel.messages.fetch(message).then(msg => {
                msg.edit( 
                    new Discord.MessageEmbed()
                    .setAuthor(channel.guild.name + `'s Music Queue${title}`, channel.guild.iconURL())
                    .setDescription(`
                    __**Currently Playing:** [${currentlyPlaying.title}](${currentlyPlaying.url})__ **[${client.users.cache.get(currentlyPlaying.user)}]**
                    
                    **Up Next:**
                    ${finalQueue}
                    ⠀⠀
                    `)
                    .setColor("#059DFF")
                    .setFooter(`To add a song to the queue, type !play <song name>`, 'https://i.ibb.co/h25ZHjQ/Playlist.png')
                )
            })
            */

        } catch(err) {
            console.log(err);
        }
    }
}