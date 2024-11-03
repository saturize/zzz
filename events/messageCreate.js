module.exports = (client, message) => {
  // IGNORE BOTS
  if (message.author.bot) return;

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