module.exports = async (event, message, client) => {

    const Discord = require("discord.js");
    const settings = client.settings.get(message.guild.id);
    const prefix = settings.prefix;
    if (!settings.tips) return;

    function tip(content, admin) {
        if (admin) if (!message.member.hasPermission('ADMINISTRATOR')) return;
        message.channel.send(`💡 **Tip:** ${content}`)
    }

    if (event === 'simulatememberjoin') {
        const welcome = settings.welcome;
        if (!welcome.channel && !welcome.message && !welcome.role) return tip(`Welcome settings have **not** yet been set up on this server. Type **\`${prefix}settings\`** and use the **arrows below the list** to navigate to the **welcome settings** and view the available customization options`, true);
        
    } else if (event === 'birthday') {
        const birthdays = settings.birthdays;
        if (!birthdays.channel && !birthdays.message && !birthdays.role) return tip(`Birthday settings have **not** yet been set up on this server. Type **\`${prefix}settings\`** and use the **arrows below the list** to navigate to the **birthday settings** and view the available customization options`, true);
    }
};