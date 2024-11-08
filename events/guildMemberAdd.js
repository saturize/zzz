const { Client, GatewayIntentBits } = require('discord.js');
const path = require('path');
const fs = require('fs');
const configPath = path.join(__dirname, '../config.json');
const config = require(configPath);

module.exports = (client) => {
    client.on('guildMemberAdd', async (member) => {
        // Canal de bienvenue
        const welcomeChannelId = config.welcomeChannelId;
        const welcomeChannel = member.guild.channels.cache.get(welcomeChannelId);
        
        if (welcomeChannel) {
            // Création de l'embed de bienvenue
            const welcomeEmbed = new EmbedBuilder()
                .setColor(config.embedColor || '#00FF00')  // Couleur par défaut si non définie
                .setTitle(`Bienvenue sur ${member.guild.name}!`)
                .setDescription(`Coucou <@${member.user.id}> ! Nous sommes ravis de t'accueillir sur **${member.guild.name}**. Amuse-toi bien ! 🎉`)
                .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
                .setFooter({ text: `Nous sommes maintenant ${member.guild.memberCount} membres!` })
                .setTimestamp();
            
            // Envoi de l'embed avec la mention dans le message
            welcomeChannel.send({
                content: `Bienvenue, <@${member.user.id}>!`,
                embeds: [welcomeEmbed]
            });
        } else {
            console.error("Le canal de bienvenue n'a pas été trouvé. Vérifiez l'ID dans config.json.");
        }

        // Ajout automatique du rôle de bienvenue si configuré
        const autoroleConfig = config.autorole;
        if (autoroleConfig.enabled && autoroleConfig.roleId) {
            const role = member.guild.roles.cache.get(autoroleConfig.roleId);
            if (role) {
                try {
                    await member.roles.add(role);
                    console.log(`Le rôle ${role.name} a été attribué à ${member.user.tag}.`);
                } catch (error) {
                    console.error(`Erreur lors de l'attribution du rôle ${role.name} à ${member.user.tag}:`, error);
                }
            }
        }
    });
};