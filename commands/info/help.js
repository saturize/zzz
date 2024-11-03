const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const path = require('path');
const config = require(path.join(__dirname, '../../config.json'));



module.exports = {
    name: 'help',

    run: async (client, message, args) => {
        
        const emojis = client.customEmojis;

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setStyle(2)
                    .setCustomId('mod')
                    .setEmoji(emojis.moderation),
                new ButtonBuilder()
                    .setStyle(2)
                    .setCustomId('info')
                    .setEmoji(emojis.info),
                new ButtonBuilder()
                    .setStyle(2)
                    .setCustomId('fun')
                    .setEmoji(emojis.fun),
                new ButtonBuilder()
                    .setStyle(2)
                    .setCustomId('interactions')
                    .setEmoji(emojis.interact),
                new ButtonBuilder()
                    .setStyle(2)
                    .setCustomId('settings')
                    .setEmoji(emojis.settings),
                new ButtonBuilder()
                    .setStyle(2)
                    .setCustomId('help')
                    .setEmoji(emojis.help),
            );

        const help = new EmbedBuilder()
            .setTitle(".gg/saturize")
            .setColor(config.embedColor)
            .setDescription(`
                ${emojis.help} **help**\n\n
                ${emojis.category} **categories :**\n
                ${emojis.moderation} \`moderation\` | *Ban, kick, slow-mode...*\n
                ${emojis.info} \`info\` | *serverinfo, userinfo, avatar...*\n
                ${emojis.fun} \`fun\` | *Poll, rate, snipe...*\n
                ${emojis.interact} \`interactions\` | *Hug, kiss, slap...*\n
                ${emojis.settings} \`settings\` | *Admin only commands.*\n\n
            `)
            .setFooter({
                text: message.member.displayName,
                iconURL: message.author.displayAvatarURL({ dynamic: true })
            })
            .setTimestamp()

        await message.reply({
            embeds: [help],
            components: [row]
        });
    }
};


helpInteraction: async (interaction) => {

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
        
        help: new EmbedBuilder()
            .setTitle("Help")
            .setColor(config.embedColor)
            .setDescription("Besoin d'aide ? Voici les catégories de commandes...\n...")
    };

    const selectedEmbed = embedMap[interaction.customId];

    if (selectedEmbed) {
        await interaction.update({ embeds: [selectedEmbed], components: [] });
    }
};