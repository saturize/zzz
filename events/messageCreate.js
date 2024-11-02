module.exports = (client, message) => {
  // Ignore all bots
  if (message.author.bot) return;

  // Ignore messages not starting with the prefix (in config.json)
  if (message.content.indexOf(client.config.prefix) !== 0) return;

  // Standard argument/command name definition
  const args = message.content.slice(client.config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  // Grab the command data from the client.commands collection
  const cmd = client.commands.get(command);

  // If the command doesn't exist, silently exit and do nothing
  if (!cmd) {
      console.error(`Command ${command} not found.`);
      return;
  }

  // Check if the command object has a `run` method
  if (typeof cmd.run !== 'function') {
      console.error(`Command ${command} does not have a run method.`);
      return;
  }

  // Run the command
  cmd.run(client, message, args);
};