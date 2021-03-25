const serverlogs = require("../moderation/serverlogs");

module.exports = {
    name: 'ban',
    description: 'when a user gets banned',

    async execute(guild, user, client) {
        const fetchedLogs = await guild.fetchAuditLogs({
            limit: 1,
            type: "MEMBER_BAN_ADD",
          });
        
          const banLog = fetchedLogs.entries.first();
        
          if (!banLog) return;
        
          const { executor, target } = banLog;
        
          if (executor === client.user) return;
        
          let reason = banLog.reason;
          if (!reason) reason = "Unspecified";
        
          if (target.id === user.id) {
            serverlogs.execute(guild, user, 'BAN', executor, reason, null, client);

          } else {
            serverlogs.execute(guild, user, 'BAN', 'Unknown', 'Unknown', null, client);

          }
    }
}