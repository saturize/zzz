const { PermissionsBitField } = require('discord.js');

exports.run = async (client, message) => {

    const { approve, decline, warning } = client.customEmojis;

    // VERIFY PERM
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
        return message.reply(`${decline} Vous n'avez pas la permission de gérer les canaux.`);
    }

    const channel = message.mentions.channels.first() || message.channel;

    try {
        await channel.permissionOverwrites.edit(channel.guild.roles.everyone, {
            SendMessages: true
        });

        message.channel.send(`${approve} Le salon a été ouvert.`);
    } catch (error) {
        message.reply(`${warning} Une erreur s'est produite en essayant de déverrouiller le canal.`);
    }
};

exports.name = "unlock";
exports.description = "Permet de rouvrir un salon.";