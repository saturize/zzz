const { PermissionsBitField } = require('discord.js');

exports.run = async (client, message, args) => {

    const { approve, decline, warning } = client.customEmojis;

    // VERIFY PERM
    if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
        return message.reply(`${decline} Vous n'avez pas la permission de débannir des membres.`);
    }

    // TAKE ID
    const userId = args[0];
    if (!userId) {
        return message.reply(`${warning} Veuillez fournir l'ID de l'utilisateur à débannir.`);
    }

    await message.guild.members.unban(userId).catch(err => {
        console.error(err);
        return message.reply(`${warning} Une erreur s'est produite lors du débannissement de l'utilisateur.`);
    });

    return message.channel.send(`${approve} L'utilisateur avec l'ID ${userId} a été débanni.`);
};

exports.name = "unban";
exports.description = "Permet de dé-ban un membre.";