require('dotenv').config();
require("./config.json");

const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require("fs");
const path = require("path");
const config = require("./config.json");
const db = require('./database');

const emojiHandler = require('./emojiHandler');
const { checkLiveStatus } = require('./twitchNotifier');
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

// Ajout de l'événement presenceUpdate
client.on('presenceUpdate', async (oldMember, newMember) => {
    try {
        // Vérification si oldMember et newMember sont définis
        if (!oldMember || !newMember) {
            console.log("oldMember ou newMember est indéfini. L'événement est ignoré.");
            return;
        }

        const guild = newMember.guild;

        if (!guild) {
            console.log("newMember.guild est indéfini.");
            return;
        }

        // Vérification de la guilde cible
        if (guild.id !== process.env.GUILD_ID) {
            console.log(`Membre hors de la guilde cible (${guild.id}).`);
            return;
        }

        // ID du rôle et du statut à rechercher
        const vanityRoleId = '1305215473960489011';
        const vanityRole = guild.roles.cache.get(vanityRoleId);
        const vanityKeyword = '.gg/saturize';

        if (!vanityRole || vanityRole.deleted) {
            console.error("Le rôle pour le statut est introuvable ou supprimé.");
            return;
        }

        // Vérification des activités
        const activities = newMember.presence?.activities || [];
        if (activities.length === 0) {
            console.log(`${newMember.user.tag} n'a pas d'activités visibles.`);
            return; // Si pas d'activités, on retourne
        }

        // Log des activités détectées
        console.log(`${newMember.user.tag} a les activités suivantes :`);
        activities.forEach((activity, index) => {
            console.log(`  Activité ${index + 1}:`);
            console.log(`    Type : ${activity.type}`);
            console.log(`    Nom : ${activity.name}`);
            console.log(`    Détails : ${activity.details}`);
            console.log(`    Statut personnalisé : ${activity.state}`);
        });

        // Extraction des statuts personnalisés
        const statuses = activities.map(activity => activity.state).filter(Boolean);
        console.log(`${newMember.user.tag} statuts détectés :`, statuses);

        // Vérification du membre dans la guilde
        const member = guild.members.cache.get(newMember.user.id);
        if (!member) {
            console.error("Impossible de récupérer le membre.");
            return;
        }

        // Vérification si le rôle est déjà attribué
        const hasVanityRole = member.roles.cache.has(vanityRoleId);

        // Vérification de la correspondance avec le mot-clé de statut
        if (statuses.some(state => state.includes(vanityKeyword))) {
            if (!hasVanityRole) {
                try {
                    await member.roles.add(vanityRole);
                    console.log(`Rôle "${vanityRole.name}" ajouté à ${member.user.tag} pour le statut personnalisé.`);
                } catch (error) {
                    console.error(`Erreur lors de l'ajout du rôle : ${error}`);
                }
            } else {
                console.log(`${member.user.tag} a déjà le rôle "${vanityRole.name}".`);
            }
        } else {
            if (hasVanityRole) {
                try {
                    await member.roles.remove(vanityRole);
                    console.log(`Rôle "${vanityRole.name}" retiré de ${member.user.tag} car le statut ne correspond plus.`);
                } catch (error) {
                    console.error(`Erreur lors du retrait du rôle : ${error}`);
                }
            }
        }
    } catch (error) {
        console.error("Erreur dans l'événement presenceUpdate :", error);
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