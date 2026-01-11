const { EmbedBuilder } = require('discord.js');
const path = require('path');
const config = require(path.join(__dirname, '../../config.json'));

exports.run = (client, message, args) => {
    const planningEmbed = new EmbedBuilder()
        .setColor(config.embedColor)
        .setDescription(`\n
# Set-up PC
\`GPU :\` MSI GeForce RTX3070
\`CPU :\` AMD RYZEN 7 3700X
\`Watercooling :\` MSI CORELIQUID 240R
# Set-up bureau
\`Ecran principal :\` MSI incurvé 27"
\`Ecran secondaire :\` Samsung 24"
\`Casque :\` Logitech Pro X Lightspeed
\`Souris :\` Logitech Pro X Superlight 2
\`Caméra :\` Logitech C920
\`Clavier :\` Razer ornata V2
\`Micro :\` Rode NT1
\`Carte Son :\` Focusrite Scarlett Solo
# Set-up VR
Valve Index
Oculus Quest 2
Vive base station 2.0 x4
Vive trackers 3.0 x3

        `)
        .setFooter({ 
            text: `Demandé par ${message.author.username}`, 
            iconURL: message.author.displayAvatarURL({ dynamic: true }) 
        })
        .setTimestamp();

    message.channel.send({ embeds: [planningEmbed] });
};

exports.name = "setup";
exports.description = "Affiche mon set-up actuel.";