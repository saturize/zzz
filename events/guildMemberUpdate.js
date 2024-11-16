const { EmbedBuilder } = require('discord.js');

module.exports = async (client, oldMember, newMember) => {
    try {
        // BOOST EMBED
        if (oldMember.premiumSince === null && newMember.premiumSince !== null) {
            const boostChannelId = '1305149965592694824';
            const boostChannel = newMember.guild.channels.cache.get(boostChannelId);

            if (!boostChannel) {
                console.error("Le canal de remerciement pour les boosts est introuvable.");
                return;
            }

            const boostEmbed = new EmbedBuilder()
                .setColor('#f47fff')
                .setAuthor({
                    name: `${newMember.user.tag}`,
                    iconURL: newMember.user.displayAvatarURL({ dynamic: true })
                })
                .setThumbnail(newMember.user.displayAvatarURL({ dynamic: true }))
                .setDescription(`**merci pour le boost !**`)

            await boostChannel.send({
                content: `<@${newMember.user.id}>`,
                embeds: [boostEmbed]
            });
            console.log(`Message de remerciement envoyé à ${newMember.user.tag} pour le boost.`);

        }

        // ROLE STATUT .GG/SATURIZE
        const specialRoleId = '1305215473960489011';
        const role = newMember.guild.roles.cache.get(specialRoleId);

        if (!role) {
            console.error("Le rôle pour le statut est introuvable.");
            return;
        }

        const customStatus = newMember.presence?.activities.find(activity => activity.type === 4);

        if (customStatus?.state && (customStatus.state.includes('.gg/saturize') || customStatus.state.includes('/saturize'))) {
            if (!newMember.roles.cache.has(specialRoleId)) {
                await newMember.roles.add(role);
                console.log(`Rôle ${role.name} attribué à ${newMember.user.tag} pour son statut.`);
            }
        } else {
            if (newMember.roles.cache.has(specialRoleId)) {
                await newMember.roles.remove(role);
                console.log(`Rôle ${role.name} retiré à ${newMember.user.tag} car le statut ne correspond plus.`);
            }
        }

    } catch (error) {
        console.error("Erreur dans guildMemberUpdate :", error);
    }
};