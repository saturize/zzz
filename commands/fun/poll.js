const { EmbedBuilder } = require('discord.js');
const path = require('path');
const config = require(path.join(__dirname, '../../config.json')); 

exports.run = async (client, message, args) => {

    const { approve, decline, warning } = client.customEmojis;

    const question = args.join(' ');
    if (!question) {
        return message.reply(`${warning} Veuillez fournir une question pour le sondage. (${approve}/${decline})`);
    }

    const pollEmbed = new EmbedBuilder()
        .setColor(config.embedColor)
        .setTitle(`${question}`)
        .setTimestamp()
        .setAuthor({
            name: message.author.username,
            iconURL: message.author.displayAvatarURL()
        });
    
    const pollMessage = await message.channel.send({ embeds: [pollEmbed] });

    await message.delete();
};

exports.name = "poll";
exports.description = "Crée un sondage (oui/non) avec des réactions."