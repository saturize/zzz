const { ActivityType } = require('discord.js');
require('dotenv').config(); // Charger les variables d'environnement

module.exports = async (oldMember, newMember) => {
    try {
        // Vérification que le membre a une présence et des activités
        if (!newMember.presence || !newMember.presence.activities) {
            console.log(`${newMember.user.tag} n'a pas de présence ou d'activités.`);
            return; // Sortir si le membre n'a pas de présence ou d'activités
        }

        // Affichage de toutes les activités pour déboguer
        console.log(`Toutes les activités de ${newMember.user.tag}:`);
        newMember.presence.activities.forEach(activity => {
            // Afficher l'activité complète pour chaque activité
            console.log(`Type: ${ActivityType[activity.type] || 'Unknown'} - State: ${activity.state || 'N/A'} - Name: ${activity.name} - URL: ${activity.url || 'N/A'}`);
        });

        // Filtrer l'activité de type Custom (statut personnalisé)
        const customStatus = newMember.presence.activities.find(activity => activity.type === ActivityType.Custom);

        // Si un statut personnalisé est trouvé
        if (customStatus) {
            console.log(`Statut personnalisé de ${newMember.user.tag}: ${customStatus.state}`);
            
            // Vérification du contenu du statut personnalisé
            if (customStatus.state && (customStatus.state.includes('.gg/saturize') || customStatus.state.includes('/saturize'))) {
                // Récupérer l'ID du rôle à attribuer
                const customStatusRoleId = process.env.CUSTOM_STATUS_ROLE_ID;
                const customStatusRole = newMember.guild.roles.cache.get(customStatusRoleId);

                if (!customStatusRole) {
                    console.error("Le rôle pour le statut est introuvable.");
                    return; // Arrêter si le rôle n'est pas trouvé
                }

                // Ajouter le rôle si ce n'est pas déjà fait
                if (!newMember.roles.cache.has(customStatusRoleId)) {
                    await newMember.roles.add(customStatusRole);
                    console.log(`Rôle ${customStatusRole.name} attribué à ${newMember.user.tag} pour son statut personnalisé.`);
                }
            }
        } else {
            console.log(`Aucun statut personnalisé détecté pour ${newMember.user.tag}`);
        }
    } catch (error) {
        console.error("Erreur dans l'événement presenceUpdate :", error);
    }
};