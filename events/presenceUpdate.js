require('dotenv').config();
const { ActivityType } = require('discord.js');

module.exports = async (oldPresence, newPresence) => {
    try {
        // Vérifier si newPresence existe et est valide
        if (!newPresence || !newPresence.guild) {
            console.error('Erreur : présence ou guilde non définie');
            return;
        }

        // Affichage de l'ID de la guilde pour s'assurer qu'on est dans la bonne guilde
        console.log('ID de la guilde de la présence:', newPresence.guild.id);
        
        // Récupérer l'ID de la guilde depuis le fichier .env
        const guildId = process.env.GUILD_ID;
        
        // Vérifier que le membre appartient bien à la guilde spécifiée
        if (newPresence.guild.id !== guildId) {
            console.log(`Le membre ${newPresence.user.tag} n'est pas dans la guilde spécifiée (${guildId}). Ignoré.`);
            return; // Ignore si le membre n'est pas dans la bonne guilde
        }

        // ID du rôle à attribuer
        const specialRoleId = '1305215473960489011';
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

        if (customStatus) {
            console.log('Statut personnalisé détecté:', customStatus.state);
        }

        // Vérifie si le statut personnalisé contient ".gg/saturize" ou "/saturize"
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