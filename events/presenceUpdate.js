const { ActivityType } = require('discord.js');

module.exports = async (oldPresence, newPresence) => {
    try {
        
        // Vérification de la guilde
        const guild = newPresence.guild;
        if (!guild) {
            console.error('Guilde introuvable dans presenceUpdate.');
            return;
        }

        // Vérification du rôle
        const specialRoleId = '1305215473960489011';
        const role = guild.roles.cache.get(specialRoleId);
        if (!role) {
            console.error(`Le rôle avec l'ID ${specialRoleId} est introuvable dans la guilde ${guild.name}.`);
            return;
        }




        

        if (!role) {
            console.error("Le rôle pour le statut est introuvable.");
            return;
        }

        const customStatus = newPresence.activities.find(
            activity => activity.type === ActivityType.Custom
        );

        if (customStatus?.state && (customStatus.state.includes('.gg/saturize') || customStatus.state.includes('/saturize'))) {
            if (!newPresence.member.roles.cache.has(specialRoleId)) {
                await newPresence.member.roles.add(role);
                console.log(`Rôle ${role.name} attribué à ${newPresence.member.user.tag} pour son statut.`);
            }
        } else {
            if (newPresence.member.roles.cache.has(specialRoleId)) {
                await newPresence.member.roles.remove(role);
                console.log(`Rôle ${role.name} retiré à ${newPresence.member.user.tag} car le statut ne correspond plus.`);
            }
        }
    } catch (error) {
        console.error("Erreur dans presenceUpdate :", error);
    }
};