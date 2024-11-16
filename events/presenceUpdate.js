require('dotenv').config();
const { ActivityType } = require('discord.js');

module.exports = async (oldPresence, newPresence) => {
    try {
        // Vérifiez que newPresence et oldPresence existent avant de procéder
        if (!newPresence || !newPresence.guild) {
            console.error("La nouvelle présence ou la guilde est introuvable.");
            return; // On arrête le traitement si la présence est invalide
        }

        // Vérification que le membre appartient à la bonne guilde
        const guildId = process.env.GUILD_ID; // Récupérer l'ID de la guilde depuis le .env
        if (newPresence.guild.id !== guildId) {
            console.log("Le membre n'appartient pas à la guilde spécifiée, ignoré.");
            return; // Ignorer si le membre n'est pas dans la guilde spécifiée
        }

        const guild = newPresence.guild; // La guilde de la présence

        // Vérification du rôle
        const specialRoleId = '1305215473960489011';
        const role = guild.roles.cache.get(specialRoleId);
        if (!role) {
            console.error(`Le rôle avec l'ID ${specialRoleId} est introuvable dans la guilde ${guild.name}.`);
            return;
        }

        // Vérification du statut personnalisé
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