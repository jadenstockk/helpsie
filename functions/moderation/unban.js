module.exports = {
    name: 'unban',
    description: 'when a user gets unbanned',

    async execute(guild, user, client) {
        const fetchedLogs = await guild.fetchAuditLogs({
            limit: 1,
            type: "MEMBER_BAN_REMOVE",
          });
        
          const banLog = fetchedLogs.entries.first();
        
          if (!banLog) return;
        
          const { executor, target } = banLog;
        
          if (executor === client.user) return;
        
          let reason = banLog.reason;
          if (!reason) reason = "Unspecified";
        
          if (target.id === user.id) {
            serverLog(user, "UNBAN", executor, reason);
          } else {
            serverLog(user, "UNBAN", "Unknown", "Unknown");
          }
    }
}