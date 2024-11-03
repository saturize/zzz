const config = require('../../config.json');

exports.run = async (client, message, args) => {
    // VERIFY PERM
    if (message.author.id !== config.ownerID) {
        return message.reply("Vous n'êtes pas autorisé à utiliser cette commande.");
    }

    if (args.length === 0) {
        return message.reply("Veuillez fournir un message à dire.");
    }

    const sayMessage = args.join(' ');

    try {
        await message.channel.send(sayMessage);

        await message.delete();
    } catch (error) {
        console.error('Erreur lors de l\'exécution de la commande say:', error);
        message.reply('Il y a eu une erreur en essayant d\'exécuter cette commande.');
    }
};

exports.name = "say";