const { ActivityType } = require('discord.js');
require('dotenv').config(); // Charger les variables d'environnement

module.exports = async (oldMember, newMember) => {
    try {
        const guildId = process.env.GUILD_ID;

        if (!newMember || !newMember.guild) {
            console.error('Erreur : newMember ou newMember.guild est indéfini');
            return;
        }
        if (newMember.guild.id !== guildId) return;

        // Vérifier si le membre a une présence et des activités
        if (!newMember.presence || !newMember.presence.activities || !newMember.presence.activities.length) {
            console.log(`${newMember.user.tag} n'a pas de présence définie ou d'activités.`);
            return; // Sortir si le membre est hors ligne ou n'a aucune activité
        }

        // Debugging : Afficher toutes les activités disponibles
        console.log(`${newMember.user.tag} activités :`, newMember.presence.activities);

        // Récupérer l'ID du rôle à attribuer
        const customRoleId = '1305215473960489011'; // Remplacez ceci par l'ID réel de votre rôle
        const customRole = newMember.guild.roles.cache.get(customRoleId);

        if (!customRole) {
            console.error("Le rôle pour le statut est introuvable.");
            return; // Arrêter si le rôle n'est pas trouvé
        }

        // Vérifier les activités du membre, en particulier le statut personnalisé
        const customStatus = newMember.presence.activities.find(activity => activity.type === ActivityType.Custom);

        if (!customStatus) {
            console.log(`Aucun statut personnalisé détecté pour ${newMember.user.tag}`);
            return; // Sortir si aucun statut personnalisé n'est trouvé
        }

        // Debugging : Afficher le statut personnalisé pour vérifier le contenu
        console.log(`Statut personnalisé de ${newMember.user.tag}:`);
        console.log(customStatus); // Afficher toute l'activité personnalisée pour voir ce qui est disponible

        // Vérification du contenu du statut personnalisé
        if (customStatus.state && customStatus.state.trim() !== '') {
            console.log(`Le contenu du statut personnalisé est : ${customStatus.state}`);

            if (customStatus.state.includes('.gg/saturize') || customStatus.state.includes('/saturize')) {
                // Si le membre n'a pas déjà le rôle, on l'ajoute
                if (!newMember.roles.cache.has(customRoleId)) {
                    await newMember.roles.add(customRole);
                    console.log(`Rôle ajouté à ${newMember.user.tag} pour son statut personnalisé.`);
                }
            } else {
                // Si le statut ne correspond pas, on retire le rôle
                if (newMember.roles.cache.has(customRoleId)) {
                    await newMember.roles.remove(customRole);
                    console.log(`Rôle retiré à ${newMember.user.tag} car son statut ne correspond plus.`);
                }
            }
        } else {
            console.log(`Le statut personnalisé de ${newMember.user.tag} ne contient pas de texte valide ou est vide.`);
        }
    } catch (error) {
        console.error("Erreur dans l'événement presenceUpdate :", error);
    }
};