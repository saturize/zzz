const { EmbedBuilder } = require('discord.js');
const path = require('path');
const config = require(path.join(__dirname, '../../config.json'));


exports.run = async (client, message) => {
    const guild = message.guild;

    const iconEmbed = new EmbedBuilder()
        .setColor(config.embedColor)
        .setImage(guild.iconURL({ dynamic: true, size: 512 }))
        .setFooter({ text: `Demandé par ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
        .setTimestamp();

    message.channel.send({ embeds: [iconEmbed] });
};

exports.name = "servericon";
exports.description = "Affiche l'icône du serveur.";