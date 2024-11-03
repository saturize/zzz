exports.run = async (client, message, args) => {

    const { approve, decline, warning } = client.customEmojis;
    
    if (args.length < 1) {
        return message.reply(`${warning} Veuillez fournir quelque chose à noter.`);
    }

    const itemToRate = args.join(' ');

    // NOTE BETWEEN 1 AND 10
    const randomRating = Math.floor(Math.random() * 11);

    message.channel.send(`Je donne à **${itemToRate}** une note de **${randomRating}/10**.`);
};

exports.name = "rate";