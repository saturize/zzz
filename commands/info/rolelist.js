const { EmbedBuilder } = require('discord.js');

exports.run = (client, message, args) => {
    if (!args.length) {
        return message.reply('Veuillez fournir le nom d\'un rôle.');
    }

    const roleName = args.join(' ').toLowerCase();

    const role = message.guild.roles.cache.find(r => 
        r.name.toLowerCase() === roleName ||
        r.id === args[0] ||
        message.mentions.roles.has(r.id)    
    );

    if (!role) {
        return message.reply('Rôle non trouvé.');
    }

    const membersWithRole = role.members.map(member => member).join(', ');

    if (membersWithRole.length === 0) {
        return message.reply(`Aucun membre n'a le rôle ${role.name}.`);
    }

    const roleListEmbed = new EmbedBuilder()
        .setColor(role.hexColor)
        .setTitle(`Membres avec le rôle : ${role.name}`)
        .setDescription(membersWithRole || 'Aucun membre n\'a ce rôle.')
        .setFooter({ text: `Demandé par ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
        .setTimestamp();

    message.channel.send({ embeds: [roleListEmbed] });
};

exports.name = "rolelist";
exports.description = "Affiche une liste des membres ayant ce rôle.";