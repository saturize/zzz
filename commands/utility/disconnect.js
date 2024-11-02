exports.run = async (client, message) => {

    const verif = message.guild.emojis.cache.find(emoji => emoji.name === 'verif');

    // Vérifiez si l'auteur est le propriétaire du bot
    if (message.author.id !== client.config.ownerID) {
        return message.reply("Vous n'avez pas la permission d'utiliser cette commande.");
    }

    // Envoyez un message de confirmation avant de déconnecter le bot
    await message.reply(`Déconnexion du bot.`);

    // Déconnectez le bot
    try {
        await client.destroy();
        console.log('Bot déconnecté avec succès.');
    } catch (error) {
        console.error('Erreur lors de la déconnexion du bot:', error);
        message.reply("Il y a eu une erreur lors de la déconnexion du bot.");
    }
};

exports.name = "disconnect";