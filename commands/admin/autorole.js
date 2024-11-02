const { ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, EmbedBuilder } = require('discord.js');
const path = require('path');
const fs = require('fs');
const configPath = path.join(__dirname, '../../config.json'); 
let config = require(configPath);

module.exports = {
    name: 'autorole',
    description: 'Gère les paramètres d\'auto-rôle',
    run: async (client, message, args) => {
        // Vérifie que l'utilisateur a les permissions nécessaires
        if (!message.member.permissions.has('MANAGE_ROLES')) {
            return message.reply('Vous n\'avez pas la permission d\'utiliser cette commande.');
        }

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('activate_autorole')
                    .setLabel('Activer l\'auto-rôle')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('disable_autorole')
                    .setLabel('Désactiver l\'auto-rôle')
                    .setStyle(ButtonStyle.Danger)
            );

        const embed = new EmbedBuilder()
            .setColor(config.embedColor)
            .setDescription('Cliquez sur le bouton pour activer ou désactiver l\'auto-rôle.')
            .setFooter({ text: `Demandé par ${message.author.username}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
            .setTimestamp();

        await message.reply({
            embeds: [embed],
            components: [row]
        });
    }
};

// Fonction pour activer l'auto-rôle
const handleActivateAutorole = async (interaction) => {
    const embed = new EmbedBuilder()
        .setColor(config.embedColor)
        .setDescription('Veuillez sélectionner le rôle à attribuer automatiquement aux nouveaux membres.')
        .setFooter({ text: `Demandé par ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
        .setTimestamp();

    const roleSelectMenu = new StringSelectMenuBuilder()
        .setCustomId('select_autorole') // Assure-toi que cet ID correspond
        .setPlaceholder('Choisissez un rôle...')
        .addOptions(
            interaction.guild.roles.cache.filter(role => role.id !== interaction.guild.id).map(role => ({ // Exclut @everyone
                label: role.name,
                value: role.id
            }))
        );

    const row = new ActionRowBuilder().addComponents(roleSelectMenu);

    await interaction.update({
        content: 'Auto-rôle activé. Veuillez sélectionner le rôle.',
        embeds: [embed],
        components: [row]
    });
};

// Fonction pour désactiver l'auto-rôle
const handleDisableAutorole = async (interaction) => {
    config.autorole.enabled = false;
    config.autorole.roleId = null;

    // Sauvegarder la configuration mise à jour
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf-8');

    await interaction.update({ content: 'L\'auto-rôle a été désactivé.', components: [] });
};

// Fonction pour gérer la sélection du rôle
const handleSelectAutorole = async (interaction) => {
    const roleId = interaction.values[0];
    const role = interaction.guild.roles.cache.get(roleId);

    if (role) {
        // Enregistrer le rôle dans la configuration
        config.autorole.enabled = true;
        config.autorole.roleId = roleId;

        // Sauvegarder la configuration mise à jour dans config.json
        fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf-8');

        await interaction.reply({ content: `Le rôle automatique a été défini sur ${role.name}.`, ephemeral: true });
    } else {
        await interaction.reply({ content: 'Rôle non trouvé.', ephemeral: true });
    }
};

// Exporte les fonctions de gestion des interactions
module.exports.handleActivateAutorole = handleActivateAutorole;
module.exports.handleDisableAutorole = handleDisableAutorole;
module.exports.handleSelectAutorole = handleSelectAutorole;