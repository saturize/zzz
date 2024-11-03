const fs = require('fs');
const path = require('path');
const configPath = path.join(__dirname, '../config.json');
let config = require(configPath);

module.exports = async (client, message) => {
    if (message.author.bot) return;

    // INTO CONFIG
    config.snipe.lastDeletedMessage = {
        content: message.content,
        author: message.author.username,
        attachments: message.attachments.map(attachment => attachment.url)
    };

    // SAVE LAST CONFIG
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
};