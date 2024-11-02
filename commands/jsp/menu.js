const { ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder } = require('discord.js');
const path = require('path');
const config = require(path.join(__dirname, '../../config.json')); // Remonte de deux niveaux pour trouver config.json


exports.run = async (client, message, args) => {

    // Création de l'embed
    const embed = new EmbedBuilder()
        .setColor(config.embedColor)
        .setDescription('Choisis une option dans le menu déroulant ci-dessous !')
        .setFooter({ text: `Demandé par ${message.author.username}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
        .setTimestamp();

    // Création du menu de sélection
    const selectMenu = new StringSelectMenuBuilder()
        .setCustomId('select-menu') // Identifiant unique pour le menu
        .setPlaceholder('Choisis une option...') // Texte affiché par défaut
        .addOptions([
            {
                label: 'Option 1',
                description: 'Ceci est l\'option 1',
                value: 'option_1',
            },
            {
                label: 'Option 2',
                description: 'Ceci est l\'option 2',
                value: 'option_2',
            },
            {
                label: 'Option 3',
                description: 'Ceci est l\'option 3',
                value: 'option_3',
            },
        ]);

    // Création de la ligne d'action avec le menu de sélection
    const row = new ActionRowBuilder()
        .addComponents(selectMenu);

    // Envoi du message avec l'embed et le menu de sélection
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

    // Création du collecteur pour les interactions avec le menu de sélection
    const filter = (interaction) => interaction.customId === 'select-menu' && interaction.user.id === message.author.id;
    const collector = sentMessage.createMessageComponentCollector({ filter, time: 15000 }); // Collecteur actif pour 15 secondes

    collector.on('collect', async interaction => {
        if (!interaction.isStringSelectMenu()) return;

        // Action basée sur l'option sélectionnée
        let response;
        switch (interaction.values[0]) {
            case 'option_1':
                response = 'Tu as choisi l\'option 1 !';
                break;
            case 'option_2':
                response = 'Tu as choisi l\'option 2 !';
                break;
            case 'option_3':
                response = 'Tu as choisi l\'option 3 !';
                break;
            default:
                response = 'Option non reconnue.';
        }

        // Répondre à l'interaction du menu de sélection
        await interaction.reply({ content: response, ephemeral: true });
    });

    collector.on('end', collected => {
        console.log(`Fin de la collecte. Nombre d'interactions : ${collected.size}`);
    });
};

exports.name = "menu";