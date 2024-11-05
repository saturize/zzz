const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const path = require('path');
const config = require(path.join(__dirname, '../../config.json'));


exports.run = async (client, message, args) => {

    // VERIFY PERM
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageNicknames)) {
        return message.reply("Vous n'avez pas la permission de changer les surnoms.");
    }

    const memberToChange = message.mentions.members.first();


    // IF NO USER MENTIONNED
    if (!memberToChange) {
        return message.reply('Veuillez mentionner un membre dont vous souhaitez changer le surnom.');
    }

    // EXCLUDE MENTION IN ARGS
    const nouveauSurnom = args.slice(1).join(' ');

    // NAME GIVEN ?
    if (!nouveauSurnom) {
        return message.reply('Veuillez fournir un nouveau surnom.');
    }

    // VERIFY BOT PERM
    if (!message.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageNicknames)) {
        return message.reply("Je n'ai pas la permission de changer les surnoms des membres.");
    }

    // VERIFY HIERARCHY ROLE PERM
    if (memberToChange.roles.highest.position >= message.guild.members.me.roles.highest.position) {
        return message.reply("Je ne peux pas changer le surnom de ce membre car il est au-dessus de moi dans la hiérarchie des rôles.");
    }

    try {
        await memberToChange.setNickname(nouveauSurnom);

        const nicknameEmbed = new EmbedBuilder()
            .setColor(config.embedColor)
            .setTitle('Surnom changé')
            .setDescription(`Le surnom de ${memberToChange} a été changé en "${nouveauSurnom}".`)
            .setFooter({ text: `Demandé par ${message.author.username}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
            .setTimestamp();

        message.channel.send({ embeds: [nicknameEmbed] });
    } catch (error) {
        console.error('Erreur lors du changement de surnom:', error);
        message.reply('Échec du changement de surnom.');
    }
};

exports.name = "nickname";
exports.description = "Change le pseudo d'un membre.";