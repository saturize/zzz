require('dotenv').config();
require("./config.json");

const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require("fs");
const path = require("path");
const config = require("./config.json");
const db = require('./database');
const { checkLiveStatus } = require('./twitchNotifier');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ],
});

// CONFIG ENV DISCORD/TWITCH
client.config = config;
client.commands = new Collection();
client.buttons = new Map();
client.selectMenus = new Map();

// EVENT HANDLER
const events = fs.readdirSync("./events").filter(file => file.endsWith(".js"));
for (const file of events) {
    const eventName = file.split(".")[0];
    const event = require(`./events/${file}`);
    client.on(eventName, event.bind(null, client));
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

client.on('ready', () => {
    const guild = client.guilds.cache.get('1283047850284155022');

    if (guild) {
        const emojis = {
            approve: guild.emojis.cache.find(emoji => emoji.name === 'approve'),
            decline: guild.emojis.cache.find(emoji => emoji.name === 'decline'),
            warning: guild.emojis.cache.find(emoji => emoji.name === 'warning')
        };

        client.customEmojis = emojis;

        console.log('Bot prêt et emojis chargés.');

        if (!emojis.approve) console.warn("Emoji 'approve' non trouvé.");
        if (!emojis.decline) console.warn("Emoji 'decline' non trouvé.");
        if (!emojis.warning) console.warn("Emoji 'warning' non trouvé.");
    } else {
        console.error('Guilde non trouvée. Vérifie l\'ID de la guilde.');
    }

});

// BUTTON AND MENU
client.buttons.set('activate_autorole', require('./commands/settings/autorole').handleActivateAutorole);
client.buttons.set('disable_autorole', require('./commands/settings/autorole').handleDisableAutorole);
client.selectMenus.set('select_autorole', require('./commands/settings/autorole').handleSelectAutorole);

// INTERACTIONS
client.on('interactionCreate', async (interaction) => {
    try {
        if (interaction.isButton()) {
            const handler = client.buttons.get(interaction.customId);
            if (handler) {
                await handler(interaction);
            } else {
                console.error(`No handler found for button with ID ${interaction.customId}`);
            }
        } else if (interaction.isStringSelectMenu()) {
            const handler = client.selectMenus.get(interaction.customId);
            if (handler) {
                await handler(interaction);
            } else {
                console.error(`No handler found for select menu with ID ${interaction.customId}`);
            }
        }
    } catch (error) {
        console.error('Error handling interaction:', error);
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

// LOGIN
client.login(process.env.TOKEN).then(() => {

    // DATABASE
    db.connectToDatabase();

    // TWITCH CHECK
    setInterval(() => {
        checkLiveStatus(client);
    }, 60000);
    
});