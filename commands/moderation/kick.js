const { PermissionsBitField } = require('discord.js');

exports.run = async (client, message, [mention, ...reason]) => {
    
    const { approve, decline, warning } = client.customEmojis;
    
    // VERIFY PERM
    if (!message.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
      return message.reply(`${decline} Vous n'avez pas la permission d'utiliser cette commande.`);
  }

  // VERIFY MENTION
  if (message.mentions.members.size === 0) {
      return message.reply(`${warning} Veuillez mentionner un utilisateur à exclure.`);
  }

  // Obtenez le membre à exclure
  const kickMember = message.mentions.members.first();

  // Essayez d'exclure le membre
  try {
      await kickMember.kick(reason.join(" "));
      message.reply(`${approve} ${kickMember.user.username} a été expulsé avec succès.`);
  } catch (error) {
      message.reply(`${warning} Il y a eu une erreur en essayant d'exclure cet utilisateur.`);
  }
};

exports.name = "kick";
exports.description = "Exclue un membre.";