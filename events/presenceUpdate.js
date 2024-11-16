const { ActivityType } = require('discord.js');

module.exports = async (oldMember, newMember) => {
    try {
        if (!oldMember || !newMember) return;

        const guild = newMember.guild;
        const customStatusRoleId = '1305215473960489011';
        const customStatusRole = guild.roles.cache.get(customStatusRoleId);
        const vanity = '.gg/saturize';

        if (!customStatusRole) {
            console.error("Le rôle pour le statut est introuvable ou supprimé.");
            return;
        }

        // Vérifiez les activités du membre
        const statusStates = newMember.presence?.activities
            .filter(activity => activity.type === ActivityType.Custom)
            .map(activity => activity.state); // Récupérer tous les "state" des activités personnalisées

        if (!statusStates || statusStates.length === 0) {
            console.log(`${newMember.user.tag} n'a pas de statut personnalisé.`);
        } else {
            console.log(`Statut(s) détecté(s) pour ${newMember.user.tag}:`, statusStates);
        }

        const member = guild.members.cache.get(newMember.user.id); // Récupérer le membre dans la guilde

        if (!member) {
            console.error(`Impossible de trouver le membre ${newMember.user.tag} dans la guilde.`);
            return;
        }

        // Si le statut contient le vanity
        if (statusStates && statusStates.some(state => state?.includes(vanity))) {
            if (!member.roles.cache.has(customStatusRoleId)) {
                await member.roles.add(customStatusRole);
                console.log(`Rôle ${customStatusRole.name} attribué à ${newMember.user.tag} pour son statut personnalisé.`);
            } else {
                console.log(`${newMember.user.tag} a déjà le rôle ${customStatusRole.name}.`);
            }
        } else {
            // Si le rôle est déjà présent, mais le statut ne correspond plus
            if (member.roles.cache.has(customStatusRoleId)) {
                await member.roles.remove(customStatusRole);
                console.log(`Rôle ${customStatusRole.name} retiré de ${newMember.user.tag} car le statut ne correspond plus.`);
            }
        }
    } catch (error) {
        console.error("Erreur dans l'événement presenceUpdate :", error);
    }
};