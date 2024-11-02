const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const path = require('path');
const config = require(path.join(__dirname, '../../config.json')); // Remonte de deux niveaux pour trouver config.json


exports.run = async (client, message, args) => {
    // Vérifie si l'utilisateur a mentionné un membre
    const memberToChange = message.mentions.members.first();

    // Si aucun membre n'est mentionné, le surnom doit être fourni après la commande
    if (!memberToChange) {
        return message.reply('Veuillez mentionner un membre dont vous souhaitez changer le surnom.');
    }

    // Exclure la mention du membre des arguments pour obtenir le surnom
    const nouveauSurnom = args.slice(1).join(' ');

    // Vérifie si un surnom est fourni
    if (!nouveauSurnom) {
        return message.reply('Veuillez fournir un nouveau surnom.');
    }

    // Vérifie si l'utilisateur a la permission de gérer les surnoms
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageNicknames)) {
        return message.reply("Vous n'avez pas la permission de changer les surnoms.");
    }

    // Vérifie si le bot a les permissions nécessaires
    if (!message.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageNicknames)) {
        return message.reply("Je n'ai pas la permission de changer les surnoms des membres.");
    }

    // Vérifie si le bot est placé plus haut que le membre dans la hiérarchie des rôles
    if (memberToChange.roles.highest.position >= message.guild.members.me.roles.highest.position) {
        return message.reply("Je ne peux pas changer le surnom de ce membre car il est au-dessus de moi dans la hiérarchie des rôles.");
    }

    try {
        // Change le surnom du membre
        await memberToChange.setNickname(nouveauSurnom);

        const nicknameEmbed = new EmbedBuilder()
            .setColor(config.embedColor)
            .setTitle('Surnom changé')
            .setDescription(`Le surnom de ${memberToChange} a été changé en "${nouveauSurnom}".`)
            .setFooter({ text: `Demandé par ${message.author.username}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
            .setTimestamp();

        message.channel.send({ embeds: [nicknameEmbed] });
    } catch (error) {
        console.error('Erreur lors du changement de surnom:', error);
        message.reply('Échec du changement de surnom.');
    }
};

exports.name = "nickname";