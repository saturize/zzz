const { PermissionsBitField } = require('discord.js');

exports.run = async (client, message) => {
    // Vérifie si l'auteur a les permissions nécessaires
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
        return message.reply("Vous n'avez pas la permission de gérer les canaux.");
    }

    // Récupère le canal à déverrouiller (canal mentionné ou canal actuel)
    const channel = message.mentions.channels.first() || message.channel;

    // Modifie les permissions pour permettre aux membres d'envoyer des messages
    try {
        await channel.permissionOverwrites.edit(channel.guild.roles.everyone, {
            SendMessages: true
        });

        // Envoie un message simple indiquant que le canal est déverrouillé
        message.channel.send("Le salon a été ouvert.");
    } catch (error) {
        console.error('Erreur lors du déverrouillage du canal:', error);
        message.reply("Une erreur s'est produite en essayant de déverrouiller le canal.");
    }
};

exports.name = "unlock";