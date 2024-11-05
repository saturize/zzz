const { EmbedBuilder, ChannelType } = require('discord.js');
const path = require('path');
const config = require(path.join(__dirname, '../../config.json'));


exports.run = async (client, message, args) => {
    const channel = message.mentions.channels.first() || message.channel;

    const channelEmbed = new EmbedBuilder()
        .setColor(config.embedColor)
        .setTitle('Informations sur le salon')
        .addFields(
            { name: 'Nom', value: channel.name, inline: true },
            { name: 'ID', value: channel.id, inline: true },
            { name: 'Type', value: getChannelTypeName(channel.type), inline: true },
            { name: 'Créé le', value: `<t:${Math.floor(channel.createdTimestamp / 1000)}:R>`, inline: true },
            { name: 'Sujet', value: channel.topic || 'Aucun sujet', inline: false }
        )
        .setFooter({ text: `Demandé par ${message.author.username}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
        .setTimestamp();

    message.channel.send({ embeds: [channelEmbed] });
};

function getChannelTypeName(type) {
    switch (type) {
        case ChannelType.GuildText:
            return 'Texte';
        case ChannelType.GuildVoice:
            return 'Vocal';
        case ChannelType.GuildCategory:
            return 'Catégorie';
        case ChannelType.GuildAnnouncement:
            return 'Annonce';
        case ChannelType.PublicThread:
            return 'Fil Public';
        case ChannelType.PrivateThread:
            return 'Fil Privé';
        case ChannelType.GuildStageVoice:
            return 'Scène';
        case ChannelType.GuildForum:
            return 'Forum';
        default:
            return 'Inconnu';
    }
}

exports.name = "channelinfo";
exports.description = "Affiche les infos du salon.";