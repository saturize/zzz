const path = require('path');
const fs = require('fs');
const adjectives = require('../wordList');
const { EmbedBuilder, MessageType } = require('discord.js');

module.exports = async (client,message) => {
  // BOOST
      const boostTypes = [
    MessageType.GuildBoost,
    MessageType.GuildBoostTier1,
    MessageType.GuildBoostTier2,
    MessageType.GuildBoostTier3
  ];

  if (boostTypes.includes(message.type)) {
      const boostCount = message.guild.premiumSubscriptionCount;
      const boostLevel = message.guild.premiumTier;
    const embed = new EmbedBuilder()
      .setColor(client.config.embed?.color || '#f47fff')
      .setDescription(`
        Merci ${message.author} d'avoir boosté le serveur !
        Nous sommes maintenant à **${boostCount} boosts**, le serveur est niveau **${boostLevel}**.
      `);

    await message.channel.send({
      content: `${message.author}`,
      embeds: [embed]
    });

    console.log(`${message.author.tag} a boosté le serveur.`);
  }
}


module.exports = (client, message) => {
  // IGNORE BOTS
  if (message.author.bot) return;

  const content = message.content.toLowerCase();

  // SINGE
  if (content.includes('singe')) {
    try {
      const filePath = path.join(__dirname, '../ressources/singe.jpg');
      
      if (fs.existsSync(filePath)) {
        message.channel.send({ files: [filePath] });
      } else {
        console.warn('Image non trouvée :', filePath);
      }
      
    } catch (error) {
      console.error('Erreur en envoyant l\'image du singe:', error);
    }
  }

  // JEUNE ET ...
  if (content.includes('jeune')) {
    try {
      const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
      
      message.channel.send(`jeune et ${randomAdjective}`);
      
    } catch (error) {
      console.error('Erreur lors de la réponse avec un adjectif aléatoire:', error);
    }
  }


// IGNORE MSG NOT STARTING W PREFIX
  if (message.content.indexOf(client.config.prefix) !== 0) return;

  // STANDARD COMMAND
  const args = message.content.slice(client.config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  const cmd = client.commands.get(command);

  // COMMAND DONT EXIST
  if (!cmd) {
      console.error(`Command ${command} not found.`);
      return;
  }

  // COMMAND HAS RUN ?
  if (typeof cmd.run !== 'function') {
      console.error(`Command ${command} does not have a run method.`);
      return;
  }

  // RUN
  cmd.run(client, message, args);
};