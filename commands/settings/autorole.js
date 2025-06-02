const { ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const path = require('path');
const fs = require('fs');
const configPath = path.join(__dirname, '../../config.json'); 
let config = require(configPath);

module.exports = {
    name: 'autorole',
    description: 'Gère les paramètres d\'auto-rôle',
    run: async (client, message, args) => {
        // VERIFY PERM
        if (!config.ownerIDs.includes(message.author.id)) {
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

// ACTIVATE AUUTOROLE
const handleActivateAutorole = async (interaction) => {
    const embed = new EmbedBuilder()
        .setColor(config.embedColor)
        .setDescription('Veuillez sélectionner le rôle à attribuer automatiquement aux nouveaux membres.')
        .setFooter({ text: `Demandé par ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
        .setTimestamp();

    const roleSelectMenu = new StringSelectMenuBuilder()
        .setCustomId('select_autorole')
        .setPlaceholder('Choisissez un rôle...')
        .addOptions(
            interaction.guild.roles.cache.filter(role => role.id !== interaction.guild.id).map(role => ({ // EXCLUDE @everyone
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

// DESACTIVATE AUTOROLE
const handleDisableAutorole = async (interaction) => {
    config.autorole.enabled = false;
    config.autorole.roleId = null;

    // SAVE CONFIG IN JSON
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf-8');

    await interaction.update({ content: 'L\'auto-rôle a été désactivé.', components: [] });
};

// ROLE SELECTION GESTION
const handleSelectAutorole = async (interaction) => {
    const roleId = interaction.values[0];
    const role = interaction.guild.roles.cache.get(roleId);

    if (role) {
        // SAVE ROLE IN CONFIG
        config.autorole.enabled = true;
        config.autorole.roleId = roleId;

        // SAVE IN JSON
        fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf-8');

        await interaction.reply({ content: `Le rôle automatique a été défini sur ${role.name}.`, ephemeral: true });
    } else {
        await interaction.reply({ content: 'Rôle non trouvé.', ephemeral: true });
    }
};

// EXPORT INTERACTION GESTION
module.exports.handleActivateAutorole = handleActivateAutorole;
module.exports.handleDisableAutorole = handleDisableAutorole;
module.exports.handleSelectAutorole = handleSelectAutorole;