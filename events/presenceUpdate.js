const { ActivityType } = require('discord.js');
require('dotenv').config();

module.exports = async (oldMember, newMember) => {
    try {
        // Vérifications initiales
        if (!oldMember || !newMember) {
            console.log("oldMember ou newMember est indéfini, événement ignoré.");
            return;
        }

        if (!newMember.guild) {
            console.log("newMember.guild est null, événement ignoré.");
            return;
        }

        const guild = newMember.guild;

        // Vérification que le bot traite uniquement la guilde cible
        if (guild.id !== process.env.GUILD_ID) {
            console.log(`Membre ignoré car hors de la guilde cible (${guild.id}).`);
            return;
        }

        const vanityRoleId = '1305215473960489011'; // ID du rôle
        const vanityRole = guild.roles.cache.get(vanityRoleId);
        const vanityKeyword = '.gg/saturize';

        // Vérification de l'existence du rôle
        if (!vanityRole || vanityRole.deleted) {
            console.error("Le rôle pour le statut est introuvable ou supprimé.");
            return;
        }

        // Vérification des activités
        const activities = newMember.presence?.activities || [];
        if (activities.length === 0) {
            console.log(`${newMember.user.tag} n'a pas d'activités.`);
            return;
        }

        // Obtenir les statuts personnalisés
        const statuses = activities.map(activity => activity.state).filter(Boolean);
        console.log(`${newMember.user.tag} statuts détectés :`, statuses);

        // Récupérer le membre
        const member = guild.members.cache.get(newMember.user.id);
        if (!member) {
            console.error("Impossible de récupérer le membre.");
            return;
        }

        // Vérification si le rôle est déjà attribué
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