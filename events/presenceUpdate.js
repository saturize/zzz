require("dotenv").config(); // Charger les variables d'environnement
const { ActivityType } = require("discord.js");

module.exports = async (oldMember, newMember) => {
    try {
        // Vérification de la présence de newMember et de la guilde
        if (!newMember || !newMember.guild) {
            console.log("newMember ou sa guilde est indéfini, événement ignoré.");
            return;
        }

        // Vérification de la guilde cible
        const guildId = process.env.GUILD_ID;
        if (newMember.guild.id !== guildId) {
            console.log(`Membre ignoré car hors de la guilde cible (${guildId}).`);
            return;
        }

        console.log(
            `${newMember.user.tag} activités détectées :`,
            newMember.presence?.activities || "Aucune activité"
        );

        const customStatusRoleId = '1305215473960489011';
        const customStatusRole = newMember.guild.roles.cache.get(customStatusRoleId);
        const vanity = '.gg/saturize';

        if (!customStatusRole) {
            console.error("Le rôle pour le statut est introuvable ou supprimé.");
            return;
        }

        const activities = newMember.presence?.activities;

        if (!activities || activities.length === 0) {
            console.log(`${newMember.user.tag} activités détectées : Aucune activité`);
            return;
        }

        // Debugging : Afficher toutes les activités
        activities.forEach((activity, index) => {
            console.log(`Activité ${index + 1}:`);
            console.log(`  Type : ${activity.type}`);
            console.log(`  Nom : ${activity.name}`);
            console.log(`  Détails : ${activity.details}`);
            console.log(`  Statut personnalisé : ${activity.state}`);
        });

        const customStatus = activities.find(activity => activity.type === ActivityType.Custom);
        if (customStatus?.state && customStatus.state.includes(vanity)) {
            if (!newMember.roles.cache.has(customStatusRoleId)) {
                await newMember.roles.add(customStatusRole);
                console.log(
                    `Rôle "${customStatusRole.name}" attribué à ${newMember.user.tag} pour le statut personnalisé.`
                );
            }
        } else {
            if (newMember.roles.cache.has(customStatusRoleId)) {
                await newMember.roles.remove(customStatusRole);
                console.log(
                    `Rôle "${customStatusRole.name}" retiré de ${newMember.user.tag} car le statut ne correspond plus.`
                );
            }
        }
    } catch (error) {
        console.error("Erreur dans l'événement presenceUpdate :", error);
    }
};