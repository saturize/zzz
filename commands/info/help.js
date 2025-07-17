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
    description: "Affiche l'entièreté des commandes disponibles.",

    run: async (client, message, args) => {

        const { accessibility_key, notepad_file, joystick, interact, settings, help, regedit, twitch } = client.customEmojis;

const row = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
            .setStyle(ButtonStyle.Secondary)
            .setCustomId('mod')
            .setEmoji('<:accessibility_key:1394845540465901659>'),
        new ButtonBuilder()
            .setStyle(ButtonStyle.Secondary)
            .setCustomId('info')
            .setEmoji('<:notepad_file:1394838818506674246>'),
        new ButtonBuilder()
            .setStyle(ButtonStyle.Secondary)
            .setCustomId('fun')
            .setEmoji('<:joystick:1394844617928740925>')
    );

const row2 = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
            .setStyle(ButtonStyle.Secondary)
            .setCustomId('interactions')
            .setEmoji('<:interact:1395196085181350059>'),
        new ButtonBuilder()
            .setStyle(ButtonStyle.Secondary)
            .setCustomId('settings')
            .setEmoji('<:settings:1395193663889473659>'),
        new ButtonBuilder()
            .setStyle(ButtonStyle.Secondary)
            .setCustomId('stream')
            .setEmoji('<:twitch:1395205392283471943>')
    );


const row3 = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
            .setStyle(ButtonStyle.Secondary)
            .setCustomId('helpEmbed')
            .setEmoji('<:help:1394845035241148598>')
    );

        const helpEmbed = new EmbedBuilder()
            .setTitle(".gg/saturize")
            .setColor(config.embedColor)
            .setDescription(`
                ${help} **help**\n\n
                ${regedit} **catégories :**\n
                ${accessibility_key} \`modération\` | *ban, kick, clear...*\n
                ${notepad_file} \`info\` | *serverinfo, userinfo, avatar...*\n
                ${joystick} \`fun\` | *poll, rate, snipe...*\n
                ${interact} \`interactions\` | *hug, kiss, slap...*\n
                ${settings} \`settings\` | *admin only commands.*\n
                ${settings} \`stream\` | *live, setup, planning...*\n\n
            `)
            .setFooter({
                text: message.member.displayName,
                iconURL: message.author.displayAvatarURL({ dynamic: true })
            })
            .setTimestamp();

        await message.reply({
            embeds: [helpEmbed],
            components: [row, row2, row3]
        });
    },

    helpInteraction: async (interaction) => {
        const funCommands = loadCommands(path.join(__dirname, '../fun'));
        const infoCommands = loadCommands(path.join(__dirname, '../info'));
        const interactCommands = loadCommands(path.join(__dirname, '../interact'));
        const moderationCommands = loadCommands(path.join(__dirname, '../moderation'));
        const settingsCommands = loadCommands(path.join(__dirname, '../settings'));
        const streamCommands = loadCommands(path.join(__dirname, '../stream'));

        const embedMap = {
            mod: new EmbedBuilder()
                .setTitle("<:accessibility_key:1394845540465901659> modération")
                .setColor(config.embedColor)
                .setDescription(
                    moderationCommands.length > 0 
                    ? moderationCommands.map(cmd => `\`${cmd.name}\` - ${cmd.description || "Aucune description"}`).join('\n') 
                    : "Aucune commande de modération disponible."
                ),
            
            info: new EmbedBuilder()
                .setTitle("<:notepad_file:1394838818506674246> informations")
                .setColor(config.embedColor)
                .setDescription(
                    infoCommands.length > 0 
                    ? infoCommands.map(cmd => `\`${cmd.name}\` - ${cmd.description || "Aucune description"}`).join('\n') 
                    : "Aucune commande de modération disponible."
                ),
            
            fun: new EmbedBuilder()
                .setTitle("<:joystick:1394844617928740925> fun")
                .setColor(config.embedColor)
                .setDescription(
                    funCommands.length > 0 
                    ? funCommands.map(cmd => `\`${cmd.name}\` - ${cmd.description || "Aucune description"}`).join('\n') 
                    : "Aucune commande de modération disponible."
                ),
            
            interactions: new EmbedBuilder()
                .setTitle("<:interact:1395196085181350059> interactions")
                .setColor(config.embedColor)
                .setDescription(
                    interactCommands.length > 0 
                    ? interactCommands.map(cmd => `\`${cmd.name}\` - ${cmd.description || "Aucune description"}`).join('\n') 
                    : "Aucune commande de modération disponible."
                ),
            
            settings: new EmbedBuilder()
                .setTitle("<:settings:1395193663889473659> settings")
                .setColor(config.embedColor)
                .setDescription(
                    settingsCommands.length > 0 
                    ? settingsCommands.map(cmd => `\`${cmd.name}\` - ${cmd.description || "Aucune description"}`).join('\n') 
                    : "Aucune commande de modération disponible."
                ),

            stream: new EmbedBuilder()
                .setTitle("<:twitch:1395205392283471943> stream")
                .setColor(config.embedColor)
                .setDescription(
                    streamCommands.length > 0 
                    ? streamCommands.map(cmd => `\`${cmd.name}\` - ${cmd.description || "Aucune description"}`).join('\n') 
                    : "Aucune commande de stream disponible."
                ),
            
            helpEmbed: new EmbedBuilder()
                .setTitle(".gg/saturize")
                .setColor(config.embedColor)
                .setDescription(`
                    <:help:1394845035241148598>  **help**\n\n
                    <:regedit:1395194047676547113>  **catégories :**\n
                    <:accessibility_key:1394845540465901659> \`modération\` | *ban, kick, clear...*\n
                    <:notepad_file:1394838818506674246> \`info\` | *serverinfo, userinfo, avatar...*\n
                    <:joystick:1394844617928740925> \`fun\` | *poll, rate, snipe...*\n
                    <:interact:1395196085181350059> \`interactions\` | *hug, kiss, slap...*\n
                    <:settings:1395193663889473659> \`settings\` | *admin only commands.*\n
                    <:twitch:1395205392283471943> \`stream\` | *live, setup, planning...*\n\n
                `)
        };

        const selectedEmbed = embedMap[interaction.customId];

const row = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
            .setStyle(ButtonStyle.Secondary)
            .setCustomId('mod')
            .setEmoji('<:accessibility_key:1394845540465901659>'),
        new ButtonBuilder()
            .setStyle(ButtonStyle.Secondary)
            .setCustomId('info')
            .setEmoji('<:notepad_file:1394838818506674246>'),
        new ButtonBuilder()
            .setStyle(ButtonStyle.Secondary)
            .setCustomId('fun')
            .setEmoji('<:joystick:1394844617928740925>')
    );

const row2 = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
            .setStyle(ButtonStyle.Secondary)
            .setCustomId('interactions')
            .setEmoji('<:interact:1395196085181350059>'),
        new ButtonBuilder()
            .setStyle(ButtonStyle.Secondary)
            .setCustomId('settings')
            .setEmoji('<:settings:1395193663889473659>'),
        new ButtonBuilder()
            .setStyle(ButtonStyle.Secondary)
            .setCustomId('stream')
            .setEmoji('<:twitch:1395205392283471943>')
    );

const row3 = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
            .setStyle(ButtonStyle.Secondary)
            .setCustomId('helpEmbed')
            .setEmoji('<:help:1394845035241148598>')
    );

        if (selectedEmbed) {
            await interaction.update({ 
                embeds: [selectedEmbed], 
                components: [row, row2, row3] 
            }).catch(err => {
                console.error('Erreur lors de la mise à jour de l\'interaction:', err);
            });
        } else {
            await interaction.reply({ content: "Commande non reconnue.", ephemeral: true });
        }
    }
};