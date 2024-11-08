const { Client, GatewayIntentBits } = require('discord.js');
const path = require('path');
const configPath = path.join(__dirname, '../config.json');
const config = require(configPath);

module.exports = async (client, member) => {
    try {
        console.log(`Nouvel utilisateur: ${member.user.tag} a rejoint le serveur ${member.guild.name}`);

        // Vérification de l'ID du canal de bienvenue
        const welcomeChannelId = config.welcomeChannelId;
        if (!welcomeChannelId) {
            console.error("Aucun ID de canal de bienvenue défini dans config.json");
            return;
        }

        // Recherche du canal de bienvenue
        const welcomeChannel = member.guild.channels.cache.get(welcomeChannelId);
        if (!welcomeChannel) {
            console.error("Le canal de bienvenue avec cet ID est introuvable.");
            return;
        }

        // Création de l'embed de bienvenue
        const welcomeEmbed = new EmbedBuilder()
            .setColor(config.embedColor || '#00FF00')
            .setTitle(`Bienvenue sur ${member.guild.name}!`)
            .setDescription(`Coucou <@${member.user.id}> ! Nous sommes ravis de t'accueillir sur **${member.guild.name}**. Amuse-toi bien ! 🎉`)
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
            .setFooter({ text: `Nous sommes maintenant ${member.guild.memberCount} membres!` })
            .setTimestamp();

        // Envoi du message dans le canal de bienvenue
        await welcomeChannel.send({
            content: `Bienvenue, <@${member.user.id}>!`,
            embeds: [welcomeEmbed]
        });
        console.log(`Message de bienvenue envoyé à ${member.user.tag}.`);

        // Attribution du rôle (si activé dans la config)
        const autoroleConfig = config.autorole;
        if (autoroleConfig.enabled && autoroleConfig.roleId) {
            const role = member.guild.roles.cache.get(autoroleConfig.roleId);
            if (role) {
                await member.roles.add(role);
                console.log(`Rôle ${role.name} attribué à ${member.user.tag}.`);
            } else {
                console.error("Rôle introuvable avec l'ID spécifié dans config.json.");
            }
        }
    } catch (error) {
        console.error("Erreur lors de l'envoi du message de bienvenue :", error);
    }
};