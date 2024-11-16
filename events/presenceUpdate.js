require('dotenv').config();
const { ActivityType } = require('discord.js');

module.exports = async (oldPresence, newPresence) => {
    try {
        // Vérification de l'existence de newPresence et de la guilde
        if (!newPresence || !newPresence.guild) {
            console.error('Erreur : présence ou guilde non définie');
            return;
        }

        // Récupérer l'ID de la guilde depuis le fichier .env
        const guildId = process.env.GUILD_ID;

        // Vérification que le membre appartient bien à la guilde spécifiée
        if (newPresence.guild.id !== guildId) {
            console.log(`Le membre ${newPresence.user.tag} n'est pas dans la guilde spécifiée (${guildId}). Ignoré.`);
            return; // Ignore si le membre n'est pas dans la bonne guilde
        }

        // Récupérer l'ID du rôle à attribuer
        const specialRoleId = '1305215473960489011'; // Remplacez ceci par l'ID réel de votre rôle
        const role = newPresence.guild.roles.cache.get(specialRoleId);

        if (!role) {
            console.error("Le rôle pour le statut est introuvable.");
            return; // Arrêter si le rôle n'est pas trouvé
        }

        // Afficher les activités du membre pour vérifier les statuts personnalisés
        console.log('Activités du membre:', newPresence.activities);
        
        // Vérification du statut personnalisé
        const customStatus = newPresence.activities.find(
            activity => activity.type === ActivityType.Custom
        );

        // Si un statut personnalisé est détecté et contient ".gg/saturize"
        if (customStatus && customStatus.state && (customStatus.state.includes('.gg/saturize') || customStatus.state.includes('/saturize'))) {
            // Vérifier si le membre a déjà le rôle
            if (!newPresence.member.roles.cache.has(specialRoleId)) {
                // Ajouter le rôle si le membre ne l'a pas
                await newPresence.member.roles.add(role);
                console.log(`Rôle ${role.name} attribué à ${newPresence.member.user.tag} pour son statut.`);
            }
        } else {
            // Si le statut ne correspond pas à ".gg/saturize", retirer le rôle s'il est présent
            if (newPresence.member.roles.cache.has(specialRoleId)) {
                await newPresence.member.roles.remove(role);
                console.log(`Rôle ${role.name} retiré à ${newPresence.member.user.tag} car le statut ne correspond plus.`);
            }
        }
    } catch (error) {
        console.error("Erreur dans presenceUpdate :", error);
    }
};