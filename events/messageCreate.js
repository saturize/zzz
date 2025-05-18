// Importer la liste des adjectifs
const adjectives = require('../wordList');

module.exports = (client, message) => {
  // IGNORE BOTS
  if (message.author.bot) return;

  // Vérification si le message contient le mot "jeune" (insensible à la casse)
  const content = message.content.toLowerCase();
  if (content.includes('jeune')) {
    try {
      // Sélectionner un adjectif aléatoire dans la liste
      const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
      
      // Répondre avec "jeune et [adjectif aléatoire]"
      message.channel.send(`jeune et ${randomAdjective}`);
      
      // Note: nous ne mettons pas de "return" ici pour permettre aux commandes de continuer
      // à être traitées si le message contient à la fois "jeune" et une commande
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