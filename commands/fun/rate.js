exports.run = async (client, message, args) => {
    // Vérifiez si une chose à noter est fournie
    if (args.length < 1) {
        return message.reply("Veuillez fournir quelque chose à noter.");
    }

    // Combine les arguments pour former la chose à noter
    const itemToRate = args.join(' ');

    // Génère une note aléatoire entre 0 et 10
    const randomRating = Math.floor(Math.random() * 11); // Génère un nombre entre 0 et 10 inclus

    // Envoi du message avec la note aléatoire
    message.channel.send(`Je donne à **${itemToRate}** une note de **${randomRating}/10**.`);
};

exports.name = "rate";