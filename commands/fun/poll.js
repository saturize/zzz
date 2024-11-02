exports.run = async (client, message, args) => {
    const question = args.join(' ');
    if (!question) {
        return message.reply("Veuillez fournir une question pour le sondage.");
    }

    const pollMessage = await message.channel.send(`**${question}**`);
    await pollMessage.react('✅');
    await pollMessage.react('❌');

    await message.delete();
};

exports.name = "poll";