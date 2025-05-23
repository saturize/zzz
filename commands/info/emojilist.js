const { EmbedBuilder } = require('discord.js');
const path = require('path');
const config = require(path.join(__dirname, '../../config.json'));


exports.run = (client, message) => {
    const { guild } = message;

    const emojis = guild.emojis.cache.map(e => e.toString()).join(' ');

    const emojiListEmbed = new EmbedBuilder()
        .setColor(config.embedColor)
        .setTitle(`${guild.name}`)
        .setDescription(emojis || 'Aucun emoji trouvé.')
        .setFooter({ text: `Demandé par ${message.author.username}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
        .setTimestamp();

    message.channel.send({ embeds: [emojiListEmbed] });
};

exports.name = "emojilist";
exports.description = "Affiche les emojis du serveur.";