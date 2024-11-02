const path = require('path');
const fs = require('fs');

exports.run = async (client, message, args) => {
    // Vérifiez si l'utilisateur a les permissions nécessaires pour exécuter la commande
    if (!message.member.permissions.has('ADMINISTRATOR')) {
        return message.reply("Vous n'avez pas la permission de recharger les commandes.");
    }

    // Fonction pour recharger toutes les commandes
    const reloadAllCommands = async () => {
        const commandDir = path.join(__dirname, '../../commands'); // Chemin relatif au répertoire de travail
        console.log(`Rechargement de toutes les commandes depuis : ${commandDir}`);
        const commandFiles = await getCommandFiles(commandDir);

        for (const file of commandFiles) {
            const commandName = path.basename(file, '.js');

            // Supprimez le cache pour chaque commande
            delete require.cache[require.resolve(file)];

            // Supprimez la commande de la collection des commandes du client
            client.commands.delete(commandName);

            try {
                // Rechargez la commande
                const props = require(file);
                if (typeof props.run !== 'function') {
                    console.log(`La commande ${commandName} n'a pas une fonction 'run' valide.`);
                    continue;
                }
                client.commands.set(commandName, props);
                console.log(`La commande ${commandName} a été rechargée.`);
            } catch (error) {
                console.error(`Erreur lors du rechargement de la commande ${commandName}:`, error);
            }
        }
        return message.reply("Toutes les commandes ont été rechargées.");
    };

    // Fonction pour recharger une commande spécifique
    const reloadSingleCommand = async (commandName) => {
        const commandPath = path.join(__dirname, `../../commands/${commandName}.js`);
        console.log(`Rechargement de la commande spécifique depuis : ${commandPath}`);

        // Vérifiez si la commande existe
        if (!fs.existsSync(commandPath)) {
            return message.reply("Cette commande n'existe pas.");
        }

        // Supprimez le cache de la commande spécifiée
        delete require.cache[require.resolve(commandPath)];

        // Supprimez et rechargez la commande dans la collection du client
        client.commands.delete(commandName);

        try {
            const props = require(commandPath);
            if (typeof props.run !== 'function') {
                return message.reply(`La commande ${commandName} n'a pas une fonction 'run' valide.`);
            }
            client.commands.set(commandName, props);
            message.reply(`La commande ${commandName} a été rechargée.`);
        } catch (error) {
            console.error(`Erreur lors du rechargement de la commande ${commandName}:`, error);
            message.reply("Une erreur s'est produite lors du rechargement de cette commande.");
        }
    };

    // Si aucun argument n'est fourni, recharge toutes les commandes
    if (!args || args.length < 1) {
        return reloadAllCommands();
    }

    // Sinon, recharge une commande spécifique
    const commandName = args[0].toLowerCase();
    return reloadSingleCommand(commandName);
};

// Fonction pour obtenir les fichiers de commandes
async function getCommandFiles(dir) {
    let files = [];
    try {
        const items = await fs.promises.readdir(dir, { withFileTypes: true });

        for (const item of items) {
            const fullPath = path.join(dir, item.name);
            if (item.isDirectory()) {
                files = files.concat(await getCommandFiles(fullPath)); // Parcours récursif des sous-dossiers
            } else if (item.isFile() && item.name.endsWith('.js')) {
                files.push(fullPath);
            }
        }
    } catch (error) {
        console.error(`Erreur lors de la lecture du répertoire ${dir}:`, error);
    }
    return files;
}

exports.name = "reload";