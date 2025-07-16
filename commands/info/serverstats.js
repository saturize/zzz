const { EmbedBuilder } = require('discord.js');
const path = require('path');
const config = require(path.join(__dirname, '../../config.json'));

exports.run = async (client, message) => {
    const guild = message.guild;

    const totalMembers = guild.memberCount;
    const onlineMembers = guild.members.cache.filter(member => member.presence?.status === 'online', 'idle', 'dnd').size;
    const boostCount = guild.premiumSubscriptionCount;

    // Compte des membres dans les salons vocaux
    const voiceMembers = guild.members.cache.filter(member => member.voice.channel).size;

    const serverStatsEmbed = new EmbedBuilder()
        .setColor(config.embedColor)
        .setTitle('Statistiques du Serveur')
        .addFields(
            { name: 'Nombre de Membres', value: totalMembers.toString(), inline: true },
            { name: 'Membres en Vocal', value: voiceMembers.toString(), inline: true }, // marche pas
            { name: 'Nombre de Boosts', value: boostCount.toString(), inline: true }
        )
        .setFooter({ text: `Demandé par ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
        .setTimestamp();

    message.channel.send({ embeds: [serverStatsEmbed] });
};

exports.name = "serverstats";
exports.description = "Affiche les stats du serveur.";