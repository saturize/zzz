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
                .setDescription(`**merci pour le boost !**`);

            await boostChannel.send({
                content: `<@${newMember.user.id}>`,
                embeds: [boostEmbed]
            });
            console.log(`Message de remerciement envoyé à ${newMember.user.tag} pour le boost.`);
        }
    } catch (error) {
        console.error("Erreur dans guildMemberUpdate :", error);
    }
};