const { ActivityType } = require('discord.js');

module.exports = async (client) => {
    console.log(`Ready to serve in ${client.channels.cache.size} channels on ${client.guilds.cache.size} servers, for a total of ${client.users.cache.size} users.`);


        client.user.setActivity('error', {
            type: ActivityType.Streaming,
            url: 'https://www.twitch.tv/saturize'
        });
    
        client.user.setPresence({
            status: 'dnd',
            // activities: [
            //    { name: '.gg/saturize', type: ActivityType.Playing }
            //]
        });

    try {
        await client.guilds.fetch();
        console.log('All guilds successfully fetched.');

        client.guilds.cache.forEach(guild => {
            console.log(`Guild: ${guild.name} (${guild.id})`);
        });
    } catch (error) {
        console.error('Error fetching guilds:', error);
    }
};