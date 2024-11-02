const fs = require('fs');
const path = require('path');

exports.run = async (client, message, args) => {

    const verif = message.guild.emojis.cache.find(emoji => emoji.name === 'verif');

    // Vérifiez si l'utilisateur a les permissions nécessaires
    if (message.author.id !== client.config.ownerID) {
        return message.reply("Vous n'avez pas la permission de changer la couleur d'embed.");
    }

    // Vérifiez si une couleur est fournie
    if (args.length < 1) {
        return message.reply("Veuillez fournir une nouvelle couleur en hexadécimal (par exemple, `#FF0000`).");
    }

    const newColor = args[0];
    
    // Validation de la couleur en format hexadécimal
    if (!/^#[0-9A-F]{6}$/i.test(newColor)) {
        return message.reply("Veuillez fournir une couleur valide au format hexadécimal (par exemple, `#FF0000`).");
    }

    try {
        // Chemin vers le fichier config.json
        const configPath = path.join(__dirname, '../../config.json');
        
        // Lire le fichier config.json
        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        
        // Mettre à jour la couleur dans le fichier config
        config.embedColor = newColor;

        // Écrire les modifications dans config.json
        fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8');
        
        // Mettre à jour la couleur d'embed en mémoire
        client.config.embedColor = newColor;

        // Répondre à l'utilisateur
        message.reply(`${verif} La couleur d'embed a été changée en ${newColor}.`);
    } catch (error) {
        console.error('Erreur lors du changement de couleur d\'embed:', error);
        message.reply("Une erreur s'est produite lors du changement de couleur d'embed.");
    }
};

exports.name = "setcolor";