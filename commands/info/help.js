const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const path = require('path');
const fs = require('fs');
const config = require(path.join(__dirname, '../../config.json'));

const loadCommands = (dir) => {
    const commandFiles = fs.readdirSync(dir).filter(file => file.endsWith('.js'));
    const commands = [];

    for (const file of commandFiles) {
        const command = require(path.join(dir, file));
        commands.push(command);
    }

    return commands;
};

module.exports = {
    name: 'help',

    run: async (client, message, args) => {
        const { moderation, info, fun, interact, settings, help, category } = client.customEmojis;

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Secondary)
                    .setCustomId('mod')
                    .setEmoji('<:moderation:1302696364270026853>'),
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Secondary)
                    .setCustomId('info')
                    .setEmoji('<:info:1302694232879796265>'),
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Secondary)
                    .setCustomId('fun')
                    .setEmoji('<:fun:1302695666182520874>'),
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Secondary)
                    .setCustomId('interactions')
                    .setEmoji('<:interact:1302695110408011776>'),
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Secondary)
                    .setCustomId('settings')
                    .setEmoji('<:settings:1302714616958418995>')
            );

        const row2 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Secondary)
                    .setCustomId('helpEmbed')
                    .setEmoji('<:help:1302718126831570964>')
            );

        const helpEmbed = new EmbedBuilder()
            .setTitle(".gg/saturize")
            .setColor(config.embedColor)
            .setDescription(`
                ${help} **help**\n\n
                ${category} **catégories :**\n
                ${moderation} \`modération\` | *ban, kick, clear...*\n
                ${info} \`info\` | *serverinfo, userinfo, avatar...*\n
                ${fun} \`fun\` | *poll, rate, snipe...*\n
                ${interact} \`interactions\` | *hug, kiss, slap...*\n
                ${settings} \`settings\` | *admin only commands.*\n\n
            `)
            .setFooter({
                text: message.member.displayName,
                iconURL: message.author.displayAvatarURL({ dynamic: true })
            })
            .setTimestamp();

        await message.reply({
            embeds: [helpEmbed],
            components: [row, row2]
        });
    },

    helpInteraction: async (interaction) => {
        // Chargez les commandes de modération ici
        const moderationCommands = loadCommands(path.join(__dirname, '../moderation'));

        const embedMap = {
            mod: new EmbedBuilder()
                .setTitle("<:moderation:1302696364270026853> Moderation Commands")
                .setColor(config.embedColor)
                .setDescription(
                    moderationCommands.length > 0 
                    ? moderationCommands.map(cmd => `**${cmd.name}** - ${cmd.description || "Aucune description"}`).join('\n') 
                    : "Aucune commande de modération disponible."
                ),
            
            info: new EmbedBuilder()
                .setTitle("Information Commands")
                .setColor(config.embedColor)
                .setDescription("Liste des commandes d'information...\n..."),
            
            fun: new EmbedBuilder()
                .setTitle("Fun Commands")
                .setColor(config.embedColor)
                .setDescription("Liste des commandes fun...\n..."),
            
            interactions: new EmbedBuilder()
                .setTitle("Interactions Commands")
                .setColor(config.embedColor)
                .setDescription("Liste des commandes d'interactions...\n..."),
            
            settings: new EmbedBuilder()
                .setTitle("Settings Commands")
                .setColor(config.embedColor)
                .setDescription("Liste des commandes de paramètres...\n..."),
            
            helpEmbed: new EmbedBuilder()
                .setTitle("Help")
                .setColor(config.embedColor)
                .setDescription("Besoin d'aide ? Voici les catégories de commandes...\n...")
        };

        const selectedEmbed = embedMap[interaction.customId];

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Secondary)
                    .setCustomId('mod')
                    .setEmoji('<:moderation:1302696364270026853>'),
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Secondary)
                    .setCustomId('info')
                    .setEmoji('<:info:1302694232879796265>'),
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Secondary)
                    .setCustomId('fun')
                    .setEmoji('<:fun:1302695666182520874>'),
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Secondary)
                    .setCustomId('interactions')
                    .setEmoji('<:interact:1302695110408011776>'),
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Secondary)
                    .setCustomId('settings')
                    .setEmoji('<:settings:1302714616958418995>')
            );

        const row2 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Secondary)
                    .setCustomId('helpEmbed')
                    .setEmoji('<:help:1302718126831570964>')
            );

        if (selectedEmbed) {
            await interaction.update({ 
                embeds: [selectedEmbed], 
                components: [row, row2] 
            }).catch(err => {
                console.error('Erreur lors de la mise à jour de l\'interaction:', err);
            });
        } else {
            await interaction.reply({ content: "Commande non reconnue.", ephemeral: true });
        }
    }
};