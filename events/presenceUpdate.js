const { ActivityType } = require('discord.js');
require('dotenv').config();

module.exports = async (oldMember, newMember) => {
    try {
        // Vérification si oldMember et newMember sont définis
        if (!oldMember || !newMember) {
            console.log("oldMember ou newMember est indéfini. L'événement est ignoré.");
            return;
        }

        const guild = newMember.guild;

        if (!guild) {
            console.log("newMember.guild est indéfini.");
            return;
        }

        // Vérification de la guilde cible
        if (guild.id !== process.env.GUILD_ID) {
            console.log(`Membre hors de la guilde cible (${guild.id}).`);
            return;
        }

        // ID du rôle et du statut à rechercher
        const vanityRoleId = '1305215473960489011';
        const vanityRole = guild.roles.cache.get(vanityRoleId);
        const vanityKeyword = '.gg/saturize';

        if (!vanityRole || vanityRole.deleted) {
            console.error("Le rôle pour le statut est introuvable ou supprimé.");
            return;
        }

        // Vérification des activités
        const activities = newMember.presence?.activities || [];
        if (activities.length === 0) {
            console.log(`${newMember.user.tag} n'a pas d'activités visibles.`);
            return; // Si pas d'activités, on retourne
        }

        // Log des activités détectées
        console.log(`${newMember.user.tag} a les activités suivantes :`);
        activities.forEach((activity, index) => {
            console.log(`  Activité ${index + 1}:`);
            console.log(`    Type : ${activity.type}`);
            console.log(`    Nom : ${activity.name}`);
            console.log(`    Détails : ${activity.details}`);
            console.log(`    Statut personnalisé : ${activity.state}`);
        });

        // Extraction des statuts personnalisés
        const statuses = activities.map(activity => activity.state).filter(Boolean);
        console.log(`${newMember.user.tag} statuts détectés :`, statuses);

        // Vérification du membre dans la guilde
        const member = guild.members.cache.get(newMember.user.id);
        if (!member) {
            console.error("Impossible de récupérer le membre.");
            return;
        }

        // Vérification si le rôle est déjà attribué
        const hasVanityRole = member.roles.cache.has(vanityRoleId);

        // Vérification de la correspondance avec le mot-clé de statut
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