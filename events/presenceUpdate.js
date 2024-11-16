const { ActivityType } = require('discord.js');
require('dotenv').config(); // Charger les variables d'environnement

module.exports = async (oldMember, newMember) => {
    try {
        // Vérification que newMember existe et a une présence
        if (!newMember.presence || !newMember.presence.activities) {
            console.log(`${newMember.user.tag} n'a pas de statut ou d'activités.`);
            return; // Sortir si le membre n'a pas de présence ou d'activités
        }

        // Afficher toutes les activités du membre
        console.log(`Toutes les activités de ${newMember.user.tag}:`);
        newMember.presence.activities.forEach(activity => {
            // Affichage de l'activité complète
            console.log(`Type: ${ActivityType[activity.type] || 'Unknown'} - State: ${activity.state || 'N/A'} - Name: ${activity.name} - URL: ${activity.url || 'N/A'}`);
        });

        // Trouver le statut personnalisé s'il existe
        const customStatus = newMember.presence.activities.find(activity => activity.type === ActivityType.Custom);

        if (customStatus) {
            console.log(`Statut personnalisé détecté pour ${newMember.user.tag}: ${customStatus.state}`);
        } else {
            console.log(`Aucun statut personnalisé détecté pour ${newMember.user.tag}`);
        }

        // Exemple de logique : ajouter un rôle en fonction du statut personnalisé
        const customStatusRoleId = process.env.CUSTOM_STATUS_ROLE_ID;
        const customStatusRole = newMember.guild.roles.cache.get(customStatusRoleId);

        if (!customStatusRole) {
            console.error("Le rôle pour le statut est introuvable.");
            return; // Arrêter si le rôle n'est pas trouvé
        }

        if (customStatus?.state && (customStatus.state.includes('.gg/saturize') || customStatus.state.includes('/saturize'))) {
            // Ajouter le rôle si nécessaire
            if (!newMember.roles.cache.has(customStatusRoleId)) {
                await newMember.roles.add(customStatusRole);
                console.log(`Rôle ${customStatusRole.name} attribué à ${newMember.user.tag} pour son statut personnalisé.`);
            }
        } else {
            // Retirer le rôle si nécessaire
            if (newMember.roles.cache.has(customStatusRoleId)) {
                await newMember.roles.remove(customStatusRole);
                console.log(`Rôle ${customStatusRole.name} retiré de ${newMember.user.tag} car le statut ne correspond plus.`);
            }
        }
    } catch (error) {
        console.error("Erreur dans l'événement presenceUpdate :", error);
    }
};