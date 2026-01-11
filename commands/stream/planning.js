const { EmbedBuilder } = require('discord.js');
const path = require('path');
const config = require(path.join(__dirname, '../../config.json'));

exports.run = (client, message, args) => {
    const planningEmbed = new EmbedBuilder()
        .setTitle("Planning de stream :")
        .setColor(config.embedColor)
        .setDescription(`\n
J'ai plus de planning </3 les cours m'ont tout pris mais des fois je stream le weekend c cool

-# Je suis en stream ici : [twitch.tv/missheurte](https://twitch.tv/missheurte)
        `)
        .setFooter({ 
            text: `Demandé par ${message.author.username}`, 
            iconURL: message.author.displayAvatarURL({ dynamic: true }) 
        })
        .setTimestamp();

    message.channel.send({ embeds: [planningEmbed] });
};

exports.name = "planning";
exports.aliases = ["schedule"];
exports.description = "Affiche le planning des prochains streams.";