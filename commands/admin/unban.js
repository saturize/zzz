exports.run = async (client, message, args) => {

    // VERIFY PERM
    if (!message.member.permissions.has('BAN_MEMBERS')) {
        return message.reply("Vous n'avez pas la permission de débannir des membres.");
    }

    // TAKE ID
    const userId = args[0];
    if (!userId) {
        return message.reply("Veuillez fournir l'ID de l'utilisateur à débannir.");
    }

    await message.guild.members.unban(userId).catch(err => {
        console.error(err);
        return message.reply("Une erreur s'est produite lors du débannissement de l'utilisateur.");
    });

    return message.channel.send(`L'utilisateur avec l'ID ${userId} a été débanni.`);
};

exports.name = "unban";