const { EmbedBuilder } = require('discord.js');
const path = require('path');
const config = require(path.join(__dirname, '../../config.json')); // Remonte de deux niveaux pour trouver config.json

exports.run = async (client, message, args) => {
    const user = message.mentions.users.first() || message.author;

    try {
        // Force fetch user to ensure we have all the details including the banner
        const fetchedUser = await client.users.fetch(user.id, { force: true });

        // Vérifiez si l'utilisateur a une bannière
        const bannerURL = fetchedUser.bannerURL({ dynamic: true, size: 512 });
        if (!bannerURL) {
            return message.reply('Cet utilisateur n\'a pas de bannière.');
        }

        // Créez l'embed pour afficher la bannière de l'utilisateur
        const bannerEmbed = new EmbedBuilder()
            .setColor(config.embedColor)
            .setTitle(`Bannière de ${fetchedUser.username}`)
            .setImage(bannerURL)
            .setFooter({ text: `Demandé par ${message.author.username}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
            .setTimestamp();

        // Envoyez l'embed dans le canal
        message.channel.send({ embeds: [bannerEmbed] });
    } catch (error) {
        console.error('Erreur lors de la récupération de la bannière de l\'utilisateur:', error);
        message.reply('Une erreur est survenue en essayant de récupérer la bannière de l\'utilisateur.');
    }
};

exports.name = "banner";