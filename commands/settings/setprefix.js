const fs = require('fs');
const path = require('path');
const configPath = path.join(__dirname, '../../config.json'); 
let config = require(configPath);

exports.run = async (client, message, args) => {
    
    const { approve, decline, warning } = client.customEmojis;

    // VERIFY PERM
    if (!config.ownerIDs.includes(message.author.id)) {
        return message.reply(`${decline} Vous n'avez pas la permission d'utiliser cette commande.`);
    }

    const newPrefix = args[0];
    if (!newPrefix) return message.reply(`${warning} Veuillez fournir un nouveau préfixe.`);

    client.config.prefix = newPrefix;

    fs.writeFileSync('./config.json', JSON.stringify(client.config, null, 2), 'utf8');

    message.reply(`${approve} Préfixe changé en ${newPrefix}`);
};

exports.name = "setprefix";
exports.description = "Permet de changer le préfix du bot.";