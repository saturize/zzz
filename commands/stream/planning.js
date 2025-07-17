const { EmbedBuilder } = require('discord.js');
const path = require('path');
const config = require(path.join(__dirname, '../../config.json'));

exports.run = (client, message, args) => {
    const planningEmbed = new EmbedBuilder()
        .setTitle("Planning de stream :")
        .setColor(config.embedColor)
        .setDescription(`\n
**Lundi** — \`16h00\` — Jeu Solo\n
**Mardi** — \`16h00\` — Jeu Solo\n
**Mercredi** — \`16h00\` — Valorant\n
**Jeudi** — \`OFFLINE\`\n
**Vendredi** — \`21h00\` — League of Legends\n
**Samedi** — \`21h00\` — Valorant\n
**Dimanche** — \`OFFLINE\`

*Je suis en stream ici : [twitch.tv/saturize](https://twitch.tv/saturize)*
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