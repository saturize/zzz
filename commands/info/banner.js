const { EmbedBuilder } = require('discord.js');
const path = require('path');
const config = require(path.join(__dirname, '../../config.json'));

exports.run = async (client, message, args) => {
    const user = message.mentions.users.first() || message.author;
    const fetchedUser = await client.users.fetch(user.id, { force: true });

    // HAVE BANNER ???
    const bannerURL = fetchedUser.bannerURL({ dynamic: true, size: 512 });

    if (!bannerURL) {
        return message.reply("Cet utilisateur n'a pas de bannière.");
    }

    const bannerEmbed = new EmbedBuilder()
        .setColor(config.embedColor)
        .setTitle(`Bannière de ${fetchedUser.username}`)
        .setImage(bannerURL)
        .setFooter({ text: `Demandé par ${message.author.username}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
        .setTimestamp();

    message.channel.send({ embeds: [bannerEmbed] });
};

exports.name = "banner";
exports.description = "Affiche la bannière d'un membre.";