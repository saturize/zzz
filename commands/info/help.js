const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const path = require('path');
const config = require(path.join(__dirname, '../../config.json'));

const createHelpButtons = () => {
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
                .setEmoji('<:settings:1302714616958418995> ')
        );

    const row2 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setStyle(ButtonStyle.Secondary)
                .setCustomId('helpEmbed')
                .setEmoji('<:help:1302718126831570964>')
        );

    return [row, row2];
};


module.exports = {
    name: 'help',

    run: async (client, message, args) => {
        
        const { moderation, info, fun, interact, settings, help, category } = client.customEmojis;

        const helpEmbed = new EmbedBuilder()
            .setTitle(".gg/saturize")
            .setColor(config.embedColor)
            .setDescription(`
                ${help} **help**\n\n
                ${category} **categories :**\n
                ${moderation} \`moderation\` | *Ban, kick, slow-mode...*\n
                ${info} \`info\` | *serverinfo, userinfo, avatar...*\n
                ${fun} \`fun\` | *Poll, rate, snipe...*\n
                ${interact} \`interactions\` | *Hug, kiss, slap...*\n
                ${settings} \`settings\` | *Admin only commands.*\n\n
            `)
            .setFooter({
                text: message.member.displayName,
                iconURL: message.author.displayAvatarURL({ dynamic: true })
            })
            .setTimestamp()

        const [row, row2] = createHelpButtons();

        await message.reply({
            embeds: [helpEmbed],
            components: [row, row2]
        });
    },


    helpInteraction: async (client, interaction) => {

        const { moderation, info, fun, interact, settings, help, category } = client.customEmojis;

        const embedMap = {
            mod: new EmbedBuilder()
                .setTitle("Moderation Commands")
                .setColor(config.embedColor)
                .setDescription("Liste des commandes de modération...\n..."),
        
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
        const [row, row2] = createHelpButtons();

        if (selectedEmbed) {
            await interaction.update({ embeds: [selectedEmbed], components: [row, row2] }).catch(err => {
                console.error('Erreur lors de la mise à jour de l\'interaction:', err);
            });
        } else {
            await interaction.reply({ content: "Commande non reconnue.", ephemeral: true });
        }
    }
};