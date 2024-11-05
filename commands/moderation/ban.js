const { PermissionsBitField } = require('discord.js');

exports.run = async (client, message, args) => {

    const { approve, decline, warning } = client.customEmojis;

    // VERIFY PERM
    if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
        return message.reply(`${decline} Vous n'avez pas la permission de bannir des membres.`);
    }

    const user = message.mentions.users.first();
    if (!user) {
        return message.reply(`${warning} Veuillez mentionner un utilisateur à bannir.`);
    }

    const reason = args.slice(1).join(' ') || 'Aucune raison spécifiée';

    try {
        await message.guild.members.ban(user, { reason });
        message.reply(`${approve} ${user.tag} a été banni avec succès.`);
    } catch (error) {
        message.reply(`${warning} Il y a eu une erreur en essayant de bannir cet utilisateur.`);
    }
};
exports.name = "ban";
exports.description = "Permet de bannir un membre.";