const { EmbedBuilder } = require('discord.js');
const path = require('path');
const config = require(path.join(__dirname, '../../config.json')); // Remonte de deux niveaux pour trouver config.json


exports.run = (client, message) => {
    const { guild } = message;

    // Récupérer la liste des emojis du serveur
    const emojis = guild.emojis.cache.map(e => e.toString()).join(' ');

    // Créer l'embed pour afficher la liste des emojis
    const emojiListEmbed = new EmbedBuilder()
        .setColor(config.embedColor)
        .setTitle(`Liste des emojis de ${guild.name}`)
        .setDescription(emojis || 'Aucun emoji trouvé.') // Afficher un message si aucune emoji n'est trouvée
        .setFooter({ text: `Demandé par ${message.author.username}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
        .setTimestamp();

    // Envoyer l'embed dans le canal
    message.channel.send({ embeds: [emojiListEmbed] });
};

exports.name = "emojilist";