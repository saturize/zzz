const { PermissionsBitField } = require('discord.js');

exports.run = async (client, message) => {
    // VERIFY PERM
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
        return message.reply("Vous n'avez pas la permission de gérer les canaux.");
    }

    const channel = message.mentions.channels.first() || message.channel;

    try {
        await channel.permissionOverwrites.edit(channel.guild.roles.everyone, {
            SendMessages: true
        });

        message.channel.send("Le salon a été ouvert.");
    } catch (error) {
        console.error('Erreur lors du déverrouillage du canal:', error);
        message.reply("Une erreur s'est produite en essayant de déverrouiller le canal.");
    }
};

exports.name = "unlock";