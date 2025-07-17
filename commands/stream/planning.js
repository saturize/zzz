const { EmbedBuilder } = require('discord.js');
const path = require('path');
const config = require(path.join(__dirname, '../../config.json'));

exports.run = (client, message, args) => {
    const planningEmbed = new EmbedBuilder()
        .setTitle("Planning de stream :")
        .setColor(config.embedColor)
        .setDescription(`
**Lundi** — \`16h00\` — Jeu Solo
**Mardi** — \`16h00\` — Jeu Solo
**Mercredi** — \`16h00\` — Valorant
**Jeudi** — \`OFFLINE\`
**Vendredi** — \`21h00\` — League of Legends
**Samedi** — \`21h00\` — Valorant
**Dimanche** — \`OFFLINE\`

📍 Tous les lives sont sur [twitch.tv/saturize](https://twitch.tv/saturize)
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