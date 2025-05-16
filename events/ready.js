const { ActivityType } = require('discord.js');

module.exports = async (client) => {
    console.log(`Ready to serve in ${client.channels.cache.size} channels on ${client.guilds.cache.size} servers, for a total of ${client.users.cache.size} users.`);

    // Définir le statut DND sans activité
    client.user.setPresence({
        status: 'dnd',
        activities: [] // Tableau vide = pas d'activité
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