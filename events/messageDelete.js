const fs = require('fs');
const path = require('path');
const configPath = path.join(__dirname, '../config.json');
let config = require(configPath);

module.exports = async (client, message) => {
    if (message.author.bot) return;

    // into config.json
    config.snipe.lastDeletedMessage = {
        content: message.content,
        author: message.author.username,
        attachments: message.attachments.map(attachment => attachment.url)
    };

    // save last config
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
};