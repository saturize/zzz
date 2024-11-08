const { EmbedBuilder } = require('discord.js');
const path = require('path');
const config = require(path.join(__dirname, '../../config.json'));

exports.run = async (client, message, args) => {
    const welcomeChannelId = config.welcomeChannelId; 
    const welcomeChannel = message.guild.channels.cache.get(welcomeChannelId);
    
    if (!welcomeChannel) {
        return message.reply("Le canal de bienvenue n'a pas été trouvé. Assurez-vous que l'ID du canal est correct dans la configuration.");
    }

    // Création de l'embed de bienvenue
    const welcomeEmbed = new EmbedBuilder()
        .setColor(config.embedColor)
        .setTitle(`Bienvenue sur ${message.guild.name}!`)
        .setDescription(`Coucou <@${message.author.id}> ! Nous sommes ravis de t'accueillir sur **${message.guild.name}**.`)

    welcomeChannel.send({
        content: `${message.author}`,
        embeds: [welcomeEmbed]
    });
};

exports.name = "welcomeEvent";
exports.description = "Envoie un message de bienvenue dans le canal de bienvenue spécifié avec une mention.";