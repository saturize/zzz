const { PermissionsBitField } = require('discord.js');

exports.run = async (client, message, args) => {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
        return message.reply("Vous n'avez pas la permission de gérer les messages.");
    }

    const verif = message.guild.emojis.cache.find(emoji => emoji.name === 'verif');

    // Si l'argument "all" est donné, supprimez tous les messages du salon
    if (args[0] === "all") {
        let fetched;
        do {
            fetched = await message.channel.messages.fetch({ limit: 100 });
            await message.channel.bulkDelete(fetched, true);
        } while (fetched.size >= 2); // Continue à supprimer tant qu'il y a des messages

        return message.channel.send(`Tous les messages du salon ont été supprimés.`);
    }

    // Par défaut, supprimez les 30 derniers messages
    let amount = 50;

    // Si un chiffre est donné après la commande, utilisez ce chiffre
    if (args[0] && !isNaN(args[0])) {
        amount = parseInt(args[0]);
        if (amount > 100) {
            return message.reply("Vous ne pouvez pas supprimer plus de 100 messages à la fois.");
        }
    }

    // Si un utilisateur est mentionné, supprimez tous ses messages dans la plage spécifiée
    const user = message.mentions.users.first();
    if (user) {
        const messages = await message.channel.messages.fetch({ limit: amount });
        const userMessages = messages.filter(m => m.author.id === user.id);
        await message.channel.bulkDelete(userMessages, true).catch(err => {
            console.error(err);
            return message.reply("Une erreur s'est produite lors de la suppression des messages.");
        });
        return message.channel.send(`${verif} ${userMessages.size} messages de ${user.tag} ont été supprimés.`);
    }

    // Sinon, supprimez le nombre de messages spécifié (ou par défaut 30)
    await message.channel.bulkDelete(amount, true).catch(err => {
        console.error(err);
        return message.reply("Une erreur s'est produite lors de la suppression des messages.");
    });
    return message.channel.send(`${verif} ${amount} messages ont été supprimés.`);
};

exports.name = "clear";