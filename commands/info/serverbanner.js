const { EmbedBuilder } = require('discord.js');
const path = require('path');
const config = require(path.join(__dirname, '../../config.json'));


exports.run = async (client, message) => {
    const guild = message.guild;

    if (!guild.bannerURL()) {
        return message.reply('Ce serveur n\'a pas de bannière.');
    }

    const bannerEmbed = new EmbedBuilder()
        .setColor(config.embedColor)
        .setImage(guild.bannerURL({ dynamic: true, size: 512 }))
        .setFooter({ text: `Demandé par ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
        .setTimestamp();

    message.channel.send({ embeds: [bannerEmbed] });
};

exports.name = "serverbanner";
exports.description = "Affiche la bannière du serveur.";