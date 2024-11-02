require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require("fs");
const path = require("path");
const config = require("./config.json");
const { afkUsers } = require('./commands/utility/afk');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ],
});

client.config = config;
client.commands = new Collection();
client.buttons = new Map();
client.selectMenus = new Map();


// Charger les événements
const events = fs.readdirSync("./events").filter(file => file.endsWith(".js"));
for (const file of events) {
    const eventName = file.split(".")[0];
    const event = require(`./events/${file}`);
    client.on(eventName, event.bind(null, client));
}

// Charger les commandes dans les sous-dossiers
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

// Ajouter les gestionnaires de boutons et menus de sélection
client.buttons.set('activate_autorole', require('./commands/admin/autorole').handleActivateAutorole);
client.buttons.set('disable_autorole', require('./commands/admin/autorole').handleDisableAutorole);
client.selectMenus.set('select_autorole', require('./commands/admin/autorole').handleSelectAutorole);


// Gestion des interactions
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

// mode AFK
client.on('messageCreate', message => {
    if (message.author.bot) return;

    const commandPrefix = config.prefix || '.';
    const command = message.content.split(' ')[0].slice(commandPrefix.length).toLowerCase();

    if (command === 'afk') {
        return;
    }

    if (afkUsers[message.author.id]) {
        delete afkUsers[message.author.id];
        message.reply('Tu n\'es plus AFK.');
    }

    message.mentions.users.forEach(user => {
        if (afkUsers[user.id]) {
            const afkInfo = afkUsers[user.id];
            const timestamp = `<t:${afkInfo.timestamp}:R>`;
            message.reply(`${user.username} est actuellement AFK : **${afkInfo.reason}** (depuis ${timestamp})`);
        }
    });
});

// Gérer les nouveaux membres pour l'auto-rôle
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

client.login(process.env.TOKEN);