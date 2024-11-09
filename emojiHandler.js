const dotenv = require('dotenv');
dotenv.config();

const emojiHandler = async (client) => {
    const guildId = process.env.GUILD_ID;
    const guild = await client.guilds.fetch(guildId);

    if (!guild) {
        console.error('Guilde non trouvée. Vérifiez l\'ID dans le .env');
        return null;
    }

    console.log('Emojis du serveur :');
    guild.emojis.cache.forEach((emoji) => {
        console.log(`Nom: ${emoji.name}, ID: ${emoji.id}`);
    });

    const emojis = {};
    guild.emojis.cache.forEach((emoji) => {
        emojis[emoji.name] = emoji;
    });

    console.log('Emojis chargés.');
    return emojis;
};

module.exports = emojiHandler;