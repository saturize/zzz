const { EmbedBuilder } = require('discord.js');
const path = require('path');
const config = require(path.join(__dirname, '../../config.json'));

exports.run = (client, message, args) => {
    const planningEmbed = new EmbedBuilder()
        .setColor(config.embedColor)
        .setDescription(`\n
Voici une liste de tous mes réseaux où je suis active <3

-# Twitch : [twitch.tv/missheurte](https://twitch.tv/missheurte)
-# TikTok : [missheurte](https://www.tiktok.com/@missheurte)

-# Soundcloud : [heurte](https://soundcloud.com/heurte)
-# Spotify : [heurte](https://open.spotify.com/intl-fr/artist/1LkclKP7tqrbZaJr1yu68R)
        `)
        .setFooter({ 
            text: `Demandé par ${message.author.username}`, 
            iconURL: message.author.displayAvatarURL({ dynamic: true }) 
        })
        .setTimestamp();

    message.channel.send({ embeds: [planningEmbed] });
};

exports.name = "links";
exports.description = "Affiche une liste des réseaux sociaux de heurte.";