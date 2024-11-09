const dotenv = require('dotenv');
dotenv.config();

const emojiHandler = async (client) => {
    const guildId = process.env.GUILD_ID;  // L'ID de la guilde depuis le .env
    const guild = await client.guilds.fetch(guildId);

    if (!guild) {
        console.error('Guilde non trouvée. Vérifiez l\'ID dans le .env');
        return null;
    }

    // Crée un objet avec les emojis sous forme clé-nom : valeur-emoji
    const emojis = {};
    guild.emojis.cache.forEach((emoji) => {
        emojis[emoji.name] = emoji;
    });

    console.log('Emojis chargés.');
    return emojis;
};

module.exports = emojiHandler;