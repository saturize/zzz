const fs = require('fs');

exports.run = async (client, message, args) => {
    const verif = message.guild.emojis.cache.find(emoji => emoji.name === 'verif');

    if (message.author.id !== client.config.ownerID) return message.reply('Vous n\'avez pas la permission d\'utiliser cette commande.');

    const newPrefix = args[0];
    if (!newPrefix) return message.reply('Veuillez fournir un nouveau préfixe.');

    // Mettre à jour le préfixe dans la configuration du bot
    client.config.prefix = newPrefix;

    // Sauvegarder la nouvelle configuration dans le fichier config.json
    fs.writeFileSync('./config.json', JSON.stringify(client.config, null, 2), 'utf8');

    message.reply(`${verif} Préfixe changé en ${newPrefix}`);
};

exports.name = "setprefix";