const { EmbedBuilder } = require('discord.js');
const path = require('path');
const config = require(path.join(__dirname, '../../config.json'));


exports.run = (client, message, args) => {
    const user = message.mentions.users.first() || message.author;
    const avatarEmbed = new EmbedBuilder()
        .setColor(config.embedColor)
        .setImage(user.displayAvatarURL({ dynamic: true, size: 2048 }))
        .setFooter({ text: `Demandé par ${message.author.username}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
        .setTimestamp();
    message.channel.send({ embeds: [avatarEmbed] });
};

exports.name = "pic";
exports.aliases = ["avatar", "icon"];
exports.description = "Affiche l'avatar d'un membre.";