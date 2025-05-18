require('dotenv').config();

const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require("fs");
const path = require("path");
const config = require("./config.json");
const db = require('./database');

const emojiHandler = require('./emojiHandler');
//const { checkLiveStatus } = require('./twitchNotifier');
const helpModule = require('./commands/info/help');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences,
    ],
});

// CONFIG ENV DISCORD/TWITCH
client.config = config;
client.commands = new Collection();
client.buttons = new Map();
client.selectMenus = new Map();

// CHARGE LES EMOJI
client.on('ready', async () => {
    client.customEmojis = await emojiHandler(client);
});

// EVENT HANDLER
const events = fs.readdirSync("./events").filter(file => file.endsWith(".js"));
for (const file of events) {
    const eventName = file.split(".")[0];
    const event = require(`./events/${file}`);
    client.on(eventName, event.bind(null, client));
    console.log(`Événement chargé : ${eventName}`);
}

// COMMAND HANDLER
const loadCommands = (dir) => {
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const stat = fs.lstatSync(path.join(dir, file));

        if (stat.isDirectory()) {
            loadCommands(path.join(dir, file));
        } else if (file.endsWith(".js")) {
            const command = require(path.join(dir, file));
            const commandName = file.split(".")[0];

            console.log(`Attempting to load command ${commandName} from ${dir}`);
            client.commands.set(commandName, command);
        }
    }
};
loadCommands(path.join(__dirname, 'commands'));

// BUTTON AND MENU
client.buttons.set('activate_autorole', require('./commands/settings/autorole').handleActivateAutorole);
client.buttons.set('disable_autorole', require('./commands/settings/autorole').handleDisableAutorole);
client.selectMenus.set('select_autorole', require('./commands/settings/autorole').handleSelectAutorole);

client.buttons.set('mod', helpModule.helpInteraction);
client.buttons.set('info', helpModule.helpInteraction);
client.buttons.set('fun', helpModule.helpInteraction);
client.buttons.set('interactions', helpModule.helpInteraction);
client.buttons.set('settings', helpModule.helpInteraction);
client.buttons.set('helpEmbed', helpModule.helpInteraction);

// INTERACTIONS
client.on('interactionCreate', async (interaction) => {
    try {
        if (interaction.isButton()) {
            const handler = client.buttons.get(interaction.customId);
            if (handler) {
                await handler(interaction);
            } else {
                console.error(`No handler found for button with ID ${interaction.customId}`);
                await interaction.reply({ content: 'This button is not recognized.', ephemeral: true });
            }
        } else if (interaction.isStringSelectMenu()) {
            const handler = client.selectMenus.get(interaction.customId);
            if (handler) {
                await handler(interaction);
            } else {
                console.error(`No handler found for select menu with ID ${interaction.customId}`);
                await interaction.reply({ content: 'This select menu is not recognized.', ephemeral: true });
            }
        }
    } catch (error) {
        console.error('Error handling interaction:', error);
        if (interaction.deferred || interaction.replied) {
            await interaction.followUp({ content: 'An error occurred while handling your interaction.', ephemeral: true });
        } else {
            await interaction.reply({ content: 'An error occurred while handling your interaction.', ephemeral: true });
        }
    }
});

// AUTOROLE
client.on('guildMemberAdd', async (member) => {
    const autoroleConfig = config.autorole;

    if (autoroleConfig.enabled && autoroleConfig.roleId) {
        const role = member.guild.roles.cache.get(autoroleConfig.roleId);
        if (role) {
            try {
                await member.roles.add(role);
                console.log(`Le rôle ${role.name} a été attribué à ${member.user.tag}.`);
            } catch (error) {
                console.error(`Erreur lors de l'attribution du rôle ${role.name} à ${member.user.tag}:`, error);
            }
        }
    }
});

client.on("presenceUpdate", async (oldMember, newMember) => {
    if (!oldMember || !newMember) return;
    const guild = oldMember.guild;

    if (oldMember.status !== newMember.status) return;

    const vanityID = '1305215473960489011';
    const vanityRole = guild.roles.cache.get(vanityID);
    const vanity = '.gg/uet'

    if (!vanityRole || vanityRole.deleted) return;

    let status = newMember.activities.map(a => a.state);
    const member = guild.members.cache.get(newMember.user.id);

    if (!member) return;
    if (newMember.guild.roles.cache.has(vanityRole)) {
        console.error(mainFade('vanity - .gg/uet') + ` | @${member.user.tag}` + chalk.red` already ` + `has the role.`);
    } else {
        if (status[0] != null && status[0].includes(vanity)) {
            try {
                await member.roles.add(vanityID);
    
                console.log(mainFade('vanity - .gg/uet') + ` | @${member.user.tag} has now the vanity in his status.`);
            } catch (error) {
                console.error(`Error adding role: ${error}`);
            }
        } else {
            if (member.roles.cache.some((r) => r.id === vanityID)) {
                try {
                    console.error(mainFade('vanity - .gg/uet') + ` | @${member.user.tag} removed the vanity in his status.`);
                    await member.roles.remove(vanityID);
    
                } catch (error) {
                    console.error(`Error removing role: ${error}`);
                }
            }
        }
    }
});

// LOGIN
client.login(process.env.TOKEN).then(() => {

    // DATABASE
    db.connectToDatabase();

    // TWITCH CHECK
    //setInterval(() => {
    //    checkLiveStatus(client);
    //}, 60000);
    
});