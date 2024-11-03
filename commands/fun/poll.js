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
        .setFooter({ text: `Réagissez avec "approve" pour oui et "decline" pour non.` })
        .setTimestamp()
        .setAuthor({
            name: message.author.username,
            iconURL: message.author.displayAvatarURL()
        });
    
    const pollMessage = await message.channel.send({ embeds: [pollEmbed] });

    if (approve && decline) {
        await pollMessage.react(approve);
        await pollMessage.react(decline);
    } else {
        console.error("Les emojis 'approve' ou 'decline' sont introuvables.");
    }


    await message.delete();
};

exports.name = "poll";