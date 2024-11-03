const { PermissionsBitField } = require('discord.js');

exports.run = async (client, message) => {
    // VERIFY PERM
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
        return message.reply("Vous n'avez pas la permission de gérer les canaux.");
    }

    // GET LOCKED CHANNEL IF NOT GIVEN THEN CURRENT
    const channel = message.mentions.channels.first() || message.channel;

    // MODIFY PERM SO @everyone CANNOT SEND MSG
    try {
        await channel.permissionOverwrites.edit(channel.guild.roles.everyone, {
            SendMessages: false
        });

        message.channel.send("Le salon a été fermé.");
    } catch (error) {
        console.error('Erreur lors du verrouillage du canal:', error);
        message.reply("Une erreur s'est produite en essayant de verrouiller le canal.");
    }
};

exports.name = "lock";