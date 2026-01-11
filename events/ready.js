const { ActivityType } = require('discord.js');

module.exports = async (client) => {
    console.log(`Ready as ${client.user.tag}`);

    client.user.setPresence({
        status: 'dnd', // online | idle | dnd | invisible
        activities: [
            {
                name: 'heurte <3',
                type: ActivityType.Streaming,
                url: 'https://twitch.tv/missheurte' // OBLIGATOIRE
            }
        ]
    });

    try {
        await client.guilds.fetch();
        console.log('All guilds successfully fetched.');
    } catch (error) {
        console.error('Error fetching guilds:', error);
    }
};