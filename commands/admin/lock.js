const { PermissionsBitField } = require('discord.js');

exports.run = async (client, message) => {

    const { approve, decline, warning } = client.customEmojis;

    // VERIFY PERM
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
        return message.reply(`${decline} Vous n'avez pas la permission de gérer les canaux.`);
    }

    // GET LOCKED CHANNEL IF NOT GIVEN THEN CURRENT
    const channel = message.mentions.channels.first() || message.channel;

    // MODIFY PERM SO @everyone CANNOT SEND MSG
    try {
        await channel.permissionOverwrites.edit(channel.guild.roles.everyone, {
            SendMessages: false
        });

        message.channel.send(`${approve} Le salon a été fermé.`);
    } catch (error) {
        message.reply(`${warning} Une erreur s'est produite en essayant de verrouiller le canal.`);
    }
};

exports.name = "lock";