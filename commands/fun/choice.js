exports.run = async (client, message, args) => {
    
    const { warning } = client.customEmojis;

    const options = args.join(' ').split(',');

    // DELETE SPACES
    const cleanedOptions = options.map(option => option.trim()).filter(option => option.length > 0);

    // AT LEAST 2 OPTION
    if (cleanedOptions.length < 2) {
        return message.reply(`${warning} Veuillez fournir au moins deux options séparées par des virgules.`);
    }

    // RANDOM CHOOSE
    const randomIndex = Math.floor(Math.random() * cleanedOptions.length);
    const chosenOption = cleanedOptions[randomIndex];

    await message.reply(`Je choisis: ${chosenOption}`);
};

exports.name = "choice"
exports.description = "Choisi aléatoirement entre deux options données par l'utilisateur."