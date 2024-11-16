const { ActivityType } = require('discord.js');
require('dotenv').config();

module.exports = async (oldMember, newMember) => {
    try {
        if (!oldMember || !newMember) return;

        const guild = oldMember.guild;
        if (oldMember.status !== newMember.status) return;

        const vanityRoleId = '1305215473960489011';
        const vanityRole = guild.roles.cache.get(vanityRoleId);
        const vanityKeyword = '.gg/saturize';

        if (!vanityRole || vanityRole.deleted) return;

        // user has activity ?
        const activities = newMember.presence?.activities;
        if (!activities || activities.length === 0) {
            console.log(`${newMember.user.tag} n'a pas d'activités.`);
            return;
        }

        // Obtenir tous les statuts personnalisés
        const statuses = activities.map(activity => activity.state).filter(state => state); // Filtrer les valeurs null/undefined
        console.log(`${newMember.user.tag} statuts détectés :`, statuses);

        // Récupérer le membre pour manipulation des rôles
        const member = guild.members.cache.get(newMember.user.id);
        if (!member) {
            console.error("Impossible de récupérer le membre.");
            return;
        }

        // Vérifier si le membre a déjà le rôle ou non
        const hasVanityRole = member.roles.cache.has(vanityRoleId);

        // Vérification des statuts pour le mot-clé
        if (statuses.some(state => state.includes(vanityKeyword))) {
            if (!hasVanityRole) {
                try {
                    await member.roles.add(vanityRole);
                    console.log(`Rôle "${vanityRole.name}" ajouté à ${member.user.tag} pour le statut personnalisé.`);
                } catch (error) {
                    console.error(`Erreur lors de l'ajout du rôle : ${error}`);
                }
            } else {
                console.log(`${member.user.tag} a déjà le rôle "${vanityRole.name}".`);
            }
        } else {
            if (hasVanityRole) {
                try {
                    await member.roles.remove(vanityRole);
                    console.log(`Rôle "${vanityRole.name}" retiré de ${member.user.tag} car le statut ne correspond plus.`);
                } catch (error) {
                    console.error(`Erreur lors du retrait du rôle : ${error}`);
                }
            }
        }
    } catch (error) {
        console.error("Erreur dans l'événement presenceUpdate :", error);
    }
};