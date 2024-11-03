const { PermissionsBitField } = require('discord.js');

exports.run = async (client, message, [mention, ...reason]) => {
    if (!message.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
      return message.reply("Vous n'avez pas la permission d'utiliser cette commande.");
  }

  // Vérifiez si un utilisateur a été mentionné
  if (message.mentions.members.size === 0) {
      return message.reply("Veuillez mentionner un utilisateur à exclure.");
  }

  // Obtenez le membre à exclure
  const kickMember = message.mentions.members.first();

  // Essayez d'exclure le membre
  try {
      await kickMember.kick(reason.join(" "));
      message.reply(`${kickMember.user.username} a été expulsé avec succès.`);
  } catch (error) {
      console.error(`Erreur lors de l'expulsion de ${kickMember.user.username}:`, error);
      message.reply("Il y a eu une erreur en essayant d'exclure cet utilisateur.");
  }
};

exports.name = "kick";