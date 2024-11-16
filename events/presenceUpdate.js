const { ActivityType } = require('discord.js');

module.exports = async (oldMember, newMember) => {
    const customRoleId = '1305215473960489011'; // ID du rôle
    const customRole = newMember.guild.roles.cache.get(customRoleId);

    // Vérifie si le statut personnalisé inclut ".gg/saturize" ou "/saturize"
    const customStatus = newMember.presence?.activities.find(activity => activity.type === ActivityType.Custom);
    if (customStatus?.state?.includes('.gg/saturize') || customStatus?.state?.includes('/saturize')) {
        if (!newMember.roles.cache.has(customRoleId)) {
            await newMember.roles.add(customRole);
            console.log(`Rôle ajouté à ${newMember.user.tag} pour statut personnalisé.`);
        }
    } else {
        if (newMember.roles.cache.has(customRoleId)) {
            await newMember.roles.remove(customRole);
            console.log(`Rôle retiré à ${newMember.user.tag} car le statut ne correspond plus.`);
        }
    }
};