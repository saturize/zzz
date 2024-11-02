const { ActivityType } = require('discord.js');

module.exports = async (client) => {
    console.log(`Ready to serve in ${client.channels.cache.size} channels on ${client.guilds.cache.size} servers, for a total of ${client.users.cache.size} users.`);


         client.user.setActivity('.gg/saturize', {
            type: ActivityType.Streaming, // Changez ceci selon le type d'activité que vous voulez
             url: 'https://www.twitch.tv/yourchannel' // URL pour l'activité de type Streaming
        });
    
        // Définir le statut (si on enlève l'activité au dessus mdr)
        client.user.setPresence({
            status: 'dnd', // Peut être 'online', 'idle', 'dnd' (Do Not Disturb), ou 'invisible'
            activities: [
                { name: '🔗 .gg/saturize', type: ActivityType.Playing } // L'activité affichée
            ]
        });

    try {
        await client.guilds.fetch(); // Force la récupération des guildes
        console.log('All guilds successfully fetched.');

        client.guilds.cache.forEach(guild => {
            console.log(`Guild: ${guild.name} (${guild.id})`);
            guild.members.fetch(); // Assurez-vous que les membres sont chargés
            guild.members.cache.forEach(member => {
                console.log(`Member: ${member.user.tag} (${member.id})`);
            });
        });
    } catch (error) {
        console.error('Error fetching guilds:', error);
    }
};