const { EmbedBuilder } = require('discord.js');
const path = require('path');
const config = require(path.join(__dirname, '../../config.json')); // Remonte de deux niveaux pour trouver config.json
const moment = require('moment');

exports.run = async (client, message, args) => {
    // Vérifiez si un utilisateur a été mentionné, sinon utilisez l'auteur du message
    const user = message.mentions.users.first() || message.author;

    // Obtenez le membre du serveur
    const member = message.guild.members.cache.get(user.id) || await message.guild.members.fetch(user.id);

    // Formatez les dates
    const joinedServerDate = moment(member.joinedTimestamp).format('dddd, D MMMM YYYY [à] HH:mm');
    const createdAccountDate = moment(user.createdTimestamp).format('dddd, D MMMM YYYY [à] HH:mm');

    // Obtenez les timestamps relatifs de Discord
    const joinedServerTimestamp = `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`;
    const createdAccountTimestamp = `<t:${Math.floor(user.createdTimestamp / 1000)}:R>`;

    // Créez un embed pour afficher les informations
    const userInfoEmbed = new EmbedBuilder()
        .setColor(config.embedColor)
        .setTitle(`${user.username}`)
        .setDescription(`<@${user.id}>`)
        .setThumbnail(user.displayAvatarURL({ dynamic: true })) // Affiche l'avatar comme petite image dans le titre
        .addFields(
            { name: 'Pseuso', value: user.username, inline: false },
            { name: 'ID', value: user.id, inline: false },
            { name: 'Rejoint le serveur', value: `${joinedServerDate} (${joinedServerTimestamp})`, inline: false },
            { name: 'Création du compte', value: `${createdAccountDate} (${createdAccountTimestamp})`, inline: false },
            { name: 'Rôles', value: member.roles.cache.map(role => role.name).join(', ') || 'None', inline: false }
        )
        .setFooter({ text: `Demandé par ${message.author.username}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
        .setTimestamp();

    try {
        const bannerURL = user.bannerURL({ dynamic: true, size: 2048 });
        console.log('Banner URL:', bannerURL); // Log pour vérifier si le URL est correct
        if (bannerURL) {
            userInfoEmbed.setImage(bannerURL);
        } else {
            console.log('No banner found or user does not have a banner.'); // Log pour vérifier si une bannière est disponible
        }
    } catch (error) {
        console.error('Error fetching banner URL:', error);
    }

    // Envoyez l'embed
    message.channel.send({ embeds: [userInfoEmbed] });
};

exports.name = "userinfo";