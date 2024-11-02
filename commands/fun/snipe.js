const fs = require('fs');
const path = require('path');
const configPath = path.join(__dirname, '../../config.json');
let config = require(configPath);

exports.run = async (client, message, args) => {
    if (config.snipe && config.snipe.lastDeletedMessage) {
        const deletedMessage = config.snipe.lastDeletedMessage;

        let messageContent = `**${deletedMessage.author} a supprimé :**\n${deletedMessage.content || ''}`;
        await message.channel.send(messageContent);

        // attachment
        if (deletedMessage.attachments && deletedMessage.attachments.length > 0) {
            for (const attachment of deletedMessage.attachments) {
                await message.channel.send({ files: [attachment] });
            }
        }
    } else {
        await message.reply('Aucun message supprimé trouvé.');
    }
};

exports.name = 'snipe';