const { EmbedBuilder } = require('discord.js');
const path = require('path');
const config = require(path.join(__dirname, '../../config.json'));


exports.run = (client, message) => {
    const helpEmbed = new EmbedBuilder()
        .setColor(config.embedColor)
        .setTitle('Liste des commandes')
        .setDescription(client.commands.map(command => `\`${client.config.prefix}${command.name}\``).join('\n'))
        .setFooter({ text: 'Utilisez le préfixe avant chaque commande' })
        .setTimestamp();

    message.channel.send({ embeds: [helpEmbed] });
};

exports.name = "help";