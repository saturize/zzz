const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const path = require('path');
const config = require(path.join(__dirname, '../../config.json')); // Remonte de deux niveaux pour trouver config.json


exports.run = async (client, message, args) => {

    // Création de l'embed
    const embed = new EmbedBuilder()
        .setColor(config.embedColor)
        .setDescription('Clique sur le bouton ci-dessous pour voir une action !')
        .setFooter({ text: `Demandé par ${message.author.username}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
        .setTimestamp();

    // Création d'une ligne d'action (action row) avec un bouton
    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('primary') // Identifiant unique pour l'interaction avec ce bouton
                .setLabel('Clique moi !') // Texte affiché sur le bouton
                .setStyle(ButtonStyle.Primary) // Style du bouton (bleu ici)
        );

    // Envoi du message avec l'embed et le bouton
    const sentMessage = await message.channel.send({ 
        embeds: [embed], 
        components: [row] 
    });

    // Supprimer le message de commande original
    try {
        await message.delete();
        console.log('Message de commande supprimé avec succès.');
    } catch (error) {
        console.error('Erreur lors de la suppression du message:', error);
    }

    // Création du collecteur pour les interactions avec le bouton
    const filter = (interaction) => interaction.customId === 'primary' && interaction.user.id === message.author.id;
    const collector = sentMessage.createMessageComponentCollector({ filter, time: 15000 }); // Le collecteur s'arrête après 15 secondes

    collector.on('collect', async interaction => {
        if (!interaction.isButton()) return;

        // Réponse à l'interaction du bouton
        await interaction.reply({ content: `Tu as cliqué sur le bouton, ${interaction.user.username} !`, ephemeral: true });
    });

    collector.on('end', collected => {
        console.log(`Fin de la collecte. Nombre d'interactions : ${collected.size}`);
    });
};

exports.name = "button";