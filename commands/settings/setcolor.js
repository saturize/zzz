const fs = require('fs');
const path = require('path');

exports.run = async (client, message, args) => {

    const { approve, decline, warning } = client.customEmojis;

    // VERIFY PERM
    if (message.author.id !== client.config.ownerID) {
        return message.reply(`${decline} Vous n'avez pas la permission de changer la couleur d'embed.`);
    }

    // VERIFY IF COLOR IS GIVEN
    if (args.length < 1) {
        return message.reply(`${warning} Veuillez fournir une nouvelle couleur en hexadécimal (par exemple, '#FF0000').`);
    }

    const newColor = args[0];
    
    // HEXADECIMAL ONLY
    if (!/^#[0-9A-F]{6}$/i.test(newColor)) {
        return message.reply(`${warning} Veuillez fournir une couleur valide au format hexadécimal (par exemple, '#FF0000').`);
    }

    try {
        const configPath = path.join(__dirname, '../../config.json');
        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        
        config.embedColor = newColor;

        fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8');
        client.config.embedColor = newColor;

        message.reply(`${approve} La couleur d'embed a été changée en ${newColor}.`);
    } catch (error) {
        message.reply(`${warning} Une erreur s'est produite lors du changement de couleur d'embed.`);
    }
};

exports.name = `setcolor`;
exports.description = "Permet de changer la couleur des embed.";