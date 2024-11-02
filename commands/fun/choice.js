module.exports = {
    name: 'choice',
    description: 'Choisit au hasard parmi les options fournies.',
    run: async (client, message, args) => {
        // Rejoindre tous les arguments en une seule chaîne et diviser par des virgules
        const options = args.join(' ').split(',');

        // Nettoyer les espaces autour des options
        const cleanedOptions = options.map(option => option.trim()).filter(option => option.length > 0);

        // Vérifie qu'il y a au moins deux options
        if (cleanedOptions.length < 2) {
            return message.reply('Veuillez fournir au moins deux options séparées par des virgules.');
        }

        // Choisit une option au hasard parmi les options fournies
        const randomIndex = Math.floor(Math.random() * cleanedOptions.length);
        const chosenOption = cleanedOptions[randomIndex];

        // Envoie la réponse avec l'option choisie
        await message.reply(`Je choisis: ${chosenOption}`);
        }
};