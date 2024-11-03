const { PermissionsBitField } = require('discord.js');

exports.run = async (client, message, args) => {
    // VERIFY PERM
    if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
        return message.reply("Vous n'avez pas la permission de bannir des membres.");
    }

    const user = message.mentions.users.first();
    if (!user) {
        return message.reply("Veuillez mentionner un utilisateur à bannir.");
    }

    const reason = args.slice(1).join(' ') || 'Aucune raison spécifiée';

    try {
        await message.guild.members.ban(user, { reason });
        message.reply(`${user.tag} a été banni avec succès.`);
    } catch (error) {
        console.error('Erreur lors du bannissement :', error);
        message.reply("Il y a eu une erreur en essayant de bannir cet utilisateur.");
    }
};
exports.name = "ban";