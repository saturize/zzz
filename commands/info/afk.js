const fs = require('fs');

const afkUsers = {}; // Objet pour stocker les utilisateurs AFK

exports.run = async (client, message, args) => {
    const reason = args.join(' ') || `(n'a pas mentionné de raison)`; // Raison par défaut si aucune raison n'est spécifiée
    const userId = message.author.id;
    const timestamp = Math.floor(Date.now() / 1000); // Timestamp UNIX en secondes

    // Marquer l'utilisateur comme AFK
    afkUsers[userId] = {
        reason: reason,
        timestamp: timestamp, // Stocker le timestamp en secondes
    };

    message.reply(`Tu es maintenant AFK: **${reason}**`);
};

exports.name = 'afk';
exports.afkUsers = afkUsers;