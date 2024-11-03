module.exports = {
    name: 'choice',
    description: 'Choisit au hasard parmi les options fournies.',
    run: async (client, message, args) => {
        // JOIN ARG IN ONE CONST THEN SPLIT THEM W ,
        const options = args.join(' ').split(',');

        // DELETE SPACES
        const cleanedOptions = options.map(option => option.trim()).filter(option => option.length > 0);

        // AT LEAST 2 OPTION
        if (cleanedOptions.length < 2) {
            return message.reply('Veuillez fournir au moins deux options séparées par des virgules.');
        }

        // RANDOM CHOOSE
        const randomIndex = Math.floor(Math.random() * cleanedOptions.length);
        const chosenOption = cleanedOptions[randomIndex];

        await message.reply(`Je choisis: ${chosenOption}`);
        }
};