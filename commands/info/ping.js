exports.run = async (client, message, args) => {
    const sentMessage = await message.channel.send("Calcul du ping...");

    const ping = sentMessage.createdTimestamp - message.createdTimestamp;
    const apiLatency = Math.round(client.ws.ping);

    await sentMessage.edit(`<:connection:1394845385029189674>  Pong !\nLatence du message : **${ping}ms**\nLatence de l'API : **${apiLatency}ms**`);
};

exports.name = "ping";
exports.description = "Affiche la latence du message et de l'API.";