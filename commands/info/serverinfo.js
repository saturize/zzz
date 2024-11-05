const { EmbedBuilder } = require('discord.js');
const path = require('path');
const config = require(path.join(__dirname, '../../config.json'));


exports.run = (client, message) => {
    const { guild } = message;
    const serverInfoEmbed = new EmbedBuilder()
        .setColor(config.embedColor)
        .setTitle(`${guild.name}`)
        .setThumbnail(guild.iconURL({ dynamic: true }))
        .addFields(
            { name: 'ID', value: guild.id, inline: false },
            { name: 'Owner', value: `<@${guild.ownerId}>`, inline: false },
            { name: 'Nombre de membres', value: guild.memberCount.toString(), inline: false },
            { name: 'Créé le', value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:R>`, inline: true }
        )
        .setFooter({ text: `${guild.name}`, iconURL: guild.iconURL({ dynamic: true }) })
        .setTimestamp();
    message.channel.send({ embeds: [serverInfoEmbed] });
};
exports.name = "serverinfo";
exports.description = "Affiche les infos du serveur.";