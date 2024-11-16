require('dotenv').config();
const { ActivityType } = require('discord.js');

module.exports = async (oldPresence, newPresence) => {
    try {
        // Vérifiez que newPresence et oldPresence existent avant de procéder
        if (!newPresence || !newPresence.guild) {
            console.error("La nouvelle présence ou la guilde est introuvable.");
            return; // On arrête le traitement si la présence est invalide
        }

        // Vérification que le membre appartient à la guilde spécifiée dans le fichier .env
        const guildId = process.env.GUILD_ID; // Récupérer l'ID de la guilde depuis le .env
        if (newPresence.guild.id !== guildId) {
            console.log(`Le membre n'appartient pas à la guilde ${guildId}, ignoré.`);
            return; // Ignorer si le membre n'est pas dans la guilde spécifiée
        }

        const guild = newPresence.guild; // La guilde de la présence

        // Vérification du rôle
        const specialRoleId = '1305215473960489011'; // ID du rôle à attribuer
        const role = guild.roles.cache.get(specialRoleId);
        if (!role) {
            console.error(`Le rôle avec l'ID ${specialRoleId} est introuvable dans la guilde ${guild.name}.`);
            return; // Si le rôle n'est pas trouvé, on arrête le traitement
        }

        // Vérification du statut personnalisé (recherche d'un statut contenant '.gg/saturize' ou '/saturize')
        const customStatus = newPresence.activities.find(
            activity => activity.type === ActivityType.Custom
        );

        // Si l'utilisateur a un statut spécifique, on lui attribue le rôle
        if (customStatus?.state && (customStatus.state.includes('.gg/saturize') || customStatus.state.includes('/saturize'))) {
            // On vérifie si le membre n'a pas déjà ce rôle pour l'ajouter
            if (!newPresence.member.roles.cache.has(specialRoleId)) {
                await newPresence.member.roles.add(role);
                console.log(`Rôle ${role.name} attribué à ${newPresence.member.user.tag} pour son statut.`);
            }
        } else {
            // Si le membre a le rôle mais que le statut ne correspond plus, on retire le rôle
            if (newPresence.member.roles.cache.has(specialRoleId)) {
                await newPresence.member.roles.remove(role);
                console.log(`Rôle ${role.name} retiré à ${newPresence.member.user.tag} car le statut ne correspond plus.`);
            }
        }
    } catch (error) {
        console.error("Erreur dans presenceUpdate :", error);
    }
};