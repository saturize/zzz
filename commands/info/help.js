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
        const funCommands = loadCommands(path.join(__dirname, '../fun'));
        const infoCommands = loadCommands(path.join(__dirname, '../info'));
        const interactCommands = loadCommands(path.join(__dirname, '../interact'));
        const moderationCommands = loadCommands(path.join(__dirname, '../moderation'));
        const settingsCommands = loadCommands(path.join(__dirname, '../settings'));

        const embedMap = {
            mod: new EmbedBuilder()
                .setTitle("<:moderation:1302696364270026853> modération")
                .setColor(config.embedColor)
                .setDescription(
                    moderationCommands.length > 0 
                    ? moderationCommands.map(cmd => `\`${cmd.name}\` - ${cmd.description || "Aucune description"}`).join('\n') 
                    : "Aucune commande de modération disponible."
                ),
            
            info: new EmbedBuilder()
                .setTitle("<:info:1302694232879796265> informations")
                .setColor(config.embedColor)
                .setDescription(
                    infoCommands.length > 0 
                    ? infoCommands.map(cmd => `\`${cmd.name}\` - ${cmd.description || "Aucune description"}`).join('\n') 
                    : "Aucune commande de modération disponible."
                ),
            
            fun: new EmbedBuilder()
                .setTitle("<:fun:1302695666182520874> fun")
                .setColor(config.embedColor)
                .setDescription(
                    funCommands.length > 0 
                    ? funCommands.map(cmd => `\`${cmd.name}\` - ${cmd.description || "Aucune description"}`).join('\n') 
                    : "Aucune commande de modération disponible."
                ),
            
            interactions: new EmbedBuilder()
                .setTitle("<:interact:1302695110408011776> interactions")
                .setColor(config.embedColor)
                .setDescription(
                    interactCommands.length > 0 
                    ? interactCommands.map(cmd => `\`${cmd.name}\` - ${cmd.description || "Aucune description"}`).join('\n') 
                    : "Aucune commande de modération disponible."
                ),
            
            settings: new EmbedBuilder()
                .setTitle("<:settings:1302714616958418995> settings")
                .setColor(config.embedColor)
                .setDescription(
                    settingsCommands.length > 0 
                    ? settingsCommands.map(cmd => `\`${cmd.name}\` - ${cmd.description || "Aucune description"}`).join('\n') 
                    : "Aucune commande de modération disponible."
                ),
            
            helpEmbed: new EmbedBuilder()
                .setTitle(".gg/saturize")
                .setColor(config.embedColor)
                .setDescription(`
                    <:help:1302718126831570964>  **help**\n\n
                    <:filesopenwsheet:1302714227068240053>  **catégories :**\n
                    <:moderation:1302696364270026853> \`modération\` | *ban, kick, clear...*\n
                    <:info:1302694232879796265> \`info\` | *serverinfo, userinfo, avatar...*\n
                    <:fun:1302695666182520874> \`fun\` | *poll, rate, snipe...*\n
                    <:interact:1302695110408011776> \`interactions\` | *hug, kiss, slap...*\n
                    <:settings:1302714616958418995> \`settings\` | *admin only commands.*\n\n
                `)
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
exports.description = "Affiche l'entièreté des commandes disponibles.";