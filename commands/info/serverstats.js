const { EmbedBuilder } = require('discord.js');
const path = require('path');
const config = require(path.join(__dirname, '../../config.json'));

exports.run = async (client, message) => {
    const guild = message.guild;

    // Compte des membres
    const totalMembers = guild.memberCount;

    // Compte des membres en ligne
    const onlineMembers = guild.members.cache.filter(member => member.presence?.status === 'online', 'idle', 'dnd').size;

    // Compte des membres dans les salons vocaux
    const voiceMembers = guild.members.cache.filter(member => member.voice.channel).size;

    // Nombre de boosts
    const boostCount = guild.premiumSubscriptionCount;

    // Créer l'embed pour afficher les statistiques du serveur
    const serverStatsEmbed = new EmbedBuilder()
        .setColor(config.embedColor)
        .setTitle('Statistiques du Serveur')
        .addFields(
            { name: 'Nombre de Membres', value: totalMembers.toString(), inline: true },
            { name: 'Membres en Vocal', value: voiceMembers.toString(), inline: true },
            { name: 'Nombre de Boosts', value: boostCount.toString(), inline: true }
        )
        .setFooter({ text: `Demandé par ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
        .setTimestamp();

    // Envoyer l'embed dans le canal
    message.channel.send({ embeds: [serverStatsEmbed] });
};

exports.name = "serverstats";
exports.description = "Affiche les stats du serveur.";