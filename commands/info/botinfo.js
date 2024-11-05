const { EmbedBuilder, version } = require('discord.js');
const moment = require('moment');
const path = require('path');
const config = require(path.join(__dirname, '../../config.json'));

exports.run = async (client, message) => {
    const uptime = moment.duration(client.uptime).humanize();

    const botInfoEmbed = new EmbedBuilder()
        .setColor(config.embedColor)
        .setTitle(`Informations sur le robot : ${client.user.username}`)
        .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
        .addFields(
            { name: 'ID', value: client.user.id, inline: false },
            { name: 'Créateur', value: 'saturer', inline: false },
            { name: 'Uptime', value: uptime, inline: false },
            { name: 'Version de Discord.js', value: version, inline: false },
            { name: 'Nombre de serveurs', value: client.guilds.cache.size.toString(), inline: true },
            { name: 'Nombre d\'utilisateurs', value: client.users.cache.size.toString(), inline: true },
            { name: 'Nombre de salons', value: client.channels.cache.size.toString(), inline: true }
        )
        .setFooter({ text: `Demandé par ${message.author.username}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
        .setTimestamp();

    message.channel.send({ embeds: [botInfoEmbed] });
};

exports.name = "botinfo";
exports.description = "Affiche les infos du bot.";