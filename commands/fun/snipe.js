const fs = require('fs');
const path = require('path');
const configPath = path.join(__dirname, '../../config.json');
let config = require(configPath);

exports.run = async (client, message, args) => {

    const { approve, decline, warning } = client.customEmojis;

    if (config.snipe && config.snipe.lastDeletedMessage) {
        const deletedMessage = config.snipe.lastDeletedMessage;

        if (!deletedMessage.content && (!deletedMessage.attachments || deletedMessage.attachments.length === 0)) {
            await message.reply(`${decline} Aucun message supprimé trouvé.`);
            return;
        }

        let sanitizedContent = deletedMessage.content
            .replace(/@everyone/g, '`@everyone`')
            .replace(/@here/g, '`@here`')
            .replace(/<@&(\d+)>/g, '`@role`');

        let messageContent = `**${deletedMessage.author} a supprimé :**\n${sanitizedContent || ''}`;
        await message.channel.send(messageContent);

        // Envoi des pièces jointes, si présentes
        if (deletedMessage.attachments && deletedMessage.attachments.length > 0) {
            for (const attachment of deletedMessage.attachments) {
                await message.channel.send({ files: [attachment] });
            }
        }
    } else {
        await message.reply(`${decline} Aucun message supprimé trouvé.`);
    }
};


exports.name = 'snipe';