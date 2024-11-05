const { EmbedBuilder, PermissionsBitField } = require('discord.js');

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

    const permissions = role.permissions.toArray().map(perm => 
        PermissionsBitField.Flags[perm] ? perm : null
    ).filter(Boolean).join(', ') || 'Aucune permission';

    const roleInfoEmbed = new EmbedBuilder()
        .setColor(role.color)
        .setTitle('Informations sur le rôle')
        .addFields(
            { name: 'Nom', value: role.name, inline: false },
            { name: 'ID', value: role.id, inline: false },
            { name: 'Créé le', value: `<t:${Math.floor(role.createdTimestamp / 1000)}:R>`, inline: false },
            { name: 'Couleur', value: role.hexColor, inline: false },
            { name: 'Membres', value: role.members.size.toString(), inline: false },
            { name: 'Permissions', value: permissions, inline: false }
        )
        .setFooter({ text: `Demandé par ${message.author.username}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
        .setTimestamp();

    message.channel.send({ embeds: [roleInfoEmbed] });
};

exports.name = "roleinfo";
exports.description = "Affiche les informations sur un rôle.";