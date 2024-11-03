exports.run = async (client, message, args) => {

    const { approve, decline, warning } = client.customEmojis;

    const question = args.join(' ');
    if (!question) {
        return message.reply(`${warning} Veuillez fournir une question pour le sondage. (${approve}/${decline})`);
    }

    const pollMessage = await message.channel.send(`**${question}**`);
    await pollMessage.react(approve);
    await pollMessage.react(decline);

    await message.delete();
};

exports.name = "poll";