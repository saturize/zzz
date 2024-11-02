const { PermissionsBitField } = require('discord.js');

exports.run = async (client, message) => {
    // Vérifie si l'auteur a les permissions nécessaires
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
        return message.reply("Vous n'avez pas la permission de gérer les canaux.");
    }

    // Récupère le canal à verrouiller (canal mentionné ou canal actuel)
    const channel = message.mentions.channels.first() || message.channel;

    // Modifie les permissions pour empêcher les membres d'envoyer des messages (everyone)
    try {
        await channel.permissionOverwrites.edit(channel.guild.roles.everyone, {
            SendMessages: false
        });

        // Envoie un message simple indiquant que le canal est fermé
        message.channel.send("Le salon a été fermé.");
    } catch (error) {
        console.error('Erreur lors du verrouillage du canal:', error);
        message.reply("Une erreur s'est produite en essayant de verrouiller le canal.");
    }
};

exports.name = "lock";