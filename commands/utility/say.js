const config = require('../../config.json');

exports.run = async (client, message, args) => {
    // Vérifie si l'utilisateur est l'ownerID
    if (message.author.id !== config.ownerID) {
        return message.reply("Vous n'êtes pas autorisé à utiliser cette commande.");
    }

    // Vérifiez si des arguments ont été fournis
    if (args.length === 0) {
        return message.reply("Veuillez fournir un message à dire.");
    }

    // Joindre les arguments en une seule chaîne de texte
    const sayMessage = args.join(' ');

    try {
        // Envoyer le message
        await message.channel.send(sayMessage);

        // Supprimer le message de commande
        await message.delete();
    } catch (error) {
        console.error('Erreur lors de l\'exécution de la commande say:', error);
        message.reply('Il y a eu une erreur en essayant d\'exécuter cette commande.');
    }
};

exports.name = "say";