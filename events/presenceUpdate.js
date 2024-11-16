require('dotenv').config();
const { ActivityType } = require('discord.js');

module.exports = async (oldPresence, newPresence) => {
    try {
        // Récupérer l'ID de la guilde depuis le fichier .env
        const guildId = process.env.GUILD_ID;

        // Vérifier si le membre est dans la guilde spécifiée
        if (newPresence.guild.id !== guildId) {
            console.log(`Le membre ${newPresence.user.tag} n'est pas dans la guilde spécifiée (${guildId}). Ignoré.`);
            return; // Ignore si le membre n'est pas dans la guilde spécifiée
        }

        // ID du rôle à attribuer
        const specialRoleId = '1305215473960489011';
        const role = newPresence.guild.roles.cache.get(specialRoleId);

        if (!role) {
            console.error("Le rôle pour le statut est introuvable.");
            return; // Arrêter si le rôle n'est pas trouvé
        }

        // Vérification du statut personnalisé
        const customStatus = newPresence.activities.find(
            activity => activity.type === ActivityType.Custom
        );

        // Vérifie si le statut contient ".gg/saturize" ou "/saturize"
        if (customStatus?.state && (customStatus.state.includes('.gg/saturize') || customStatus.state.includes('/saturize'))) {
            // Ajoute le rôle si l'utilisateur ne l'a pas déjà
            if (!newPresence.member.roles.cache.has(specialRoleId)) {
                await newPresence.member.roles.add(role);
                console.log(`Rôle ${role.name} attribué à ${newPresence.member.user.tag} pour son statut.`);
            }
        } else {
            // Retire le rôle si le statut ne correspond plus
            if (newPresence.member.roles.cache.has(specialRoleId)) {
                await newPresence.member.roles.remove(role);
                console.log(`Rôle ${role.name} retiré à ${newPresence.member.user.tag} car le statut ne correspond plus.`);
            }
        }
    } catch (error) {
        console.error("Erreur dans presenceUpdate :", error);
    }
};