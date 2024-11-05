const { PermissionsBitField } = require('discord.js');

exports.run = async (client, message, args) => {

    const { approve, decline, warning } = client.customEmojis;
    
    // VERIFY PERM
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
        return message.reply(`${decline} Vous n'avez pas la permission de gérer les messages.`);
    }

    // IF ALL THEN DELETE ALL
    if (args[0] === "all") {
        let fetched;
        do {
            fetched = await message.channel.messages.fetch({ limit: 100 });
            await message.channel.bulkDelete(fetched, true);
        } while (fetched.size >= 2);

        return message.channel.send(`${approve} Tous les messages du salon ont été supprimés.`);
    }

    // DEFAULT DEL 50
    let amount = 50;

    // IF GIVEN THEN USE THIS NUMBER
    if (args[0] && !isNaN(args[0])) {
        amount = parseInt(args[0]);
        if (amount > 100) {
            return message.reply(`${decline} Vous ne pouvez pas supprimer plus de 100 messages à la fois.`);
        }
    }

    // CAN MENTION USER
    const user = message.mentions.users.first();
    if (user) {
        const messages = await message.channel.messages.fetch({ limit: amount });
        const userMessages = messages.filter(m => m.author.id === user.id);
        await message.channel.bulkDelete(userMessages, true).catch(err => {
            console.error(err);
            return message.reply(`${warning} Une erreur s'est produite lors de la suppression des messages.`);
        });
        return message.channel.send(`${approve} ${userMessages.size} messages de ${user.tag} ont été supprimés.`);
    }

    await message.channel.bulkDelete(amount, true).catch(err => {
        console.error(err);
        return message.reply(`${warning} Une erreur s'est produite lors de la suppression des messages.`);
    });
    return message.channel.send(`${approve} ${amount} messages ont été supprimés.`);
};

exports.name = "clear";
exports.description = "Permet de clear des messages.";