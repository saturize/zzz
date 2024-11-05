const { EmbedBuilder } = require('discord.js');
const path = require('path');
const config = require(path.join(__dirname, '../../config.json')); 
const axios = require('axios');

exports.run = async (client, message, args) => {
    const query = 'anime hug';
    const apiKey = 'AIzaSyDyd00nPpl-w5aG5RH0_Pu7fHN54q8tS_0';
    const url = `https://g.tenor.com/v2/search?q=${encodeURIComponent(query)}&key=${apiKey}&limit=50`;

    const userToHug = message.mentions.users.first();
    if (!userToHug) {
        return message.reply('Veuillez mentionner quelqu\'un à qui faire un câlin.');
    }

    try {
        const response = await axios.get(url);

        if (response.data && response.data.results && response.data.results.length > 0) {
            const randomIndex = Math.floor(Math.random() * response.data.results.length);
            const gifUrl = response.data.results[randomIndex]?.media_formats?.gif?.url || response.data.results[randomIndex]?.url;

            if (gifUrl) {
                const embed = new EmbedBuilder()
                    .setColor(config.embedColor)
                    .setDescription(`${message.author} a fait un câlin à ${userToHug}!`)
                    .setImage(gifUrl);

                await message.channel.send({ embeds: [embed] });
            } else {
                message.reply('Aucun GIF trouvé pour votre demande.');
            }
        } else {
            message.reply('Aucun résultat trouvé pour votre recherche.');
        }
    } catch (error) {
        console.error('Erreur lors de la récupération du GIF:', error);
        message.reply('Une erreur est survenue lors de la récupération du GIF.');
    }
};

exports.name = "hug";
exports.description = "Fais un câlin à un utilisateur.";