const { EmbedBuilder, Client, GatewayIntentBits } = require('discord.js');
const path = require('path');
const configPath = path.join(__dirname, '../config.json');
const config = require(configPath);

module.exports = async (client, member) => {
    try {
        console.log(`Nouvel utilisateur: ${member.user.tag} a rejoint le serveur ${member.guild.name}`);

        // IDs des salons à partir de la configuration ou directement dans le code
        const welcomeChannelId = '1302408288738213898'; // ID du salon "welcome"
        const generalChannelId = '1302407890899963914'; // ID du salon "général"
        const rolesChannelLink = 'https://discord.com/channels/1284920847441858703/1305170147505340416';

        // Recherche des salons
        const welcomeChannel = member.guild.channels.cache.get(welcomeChannelId);
        const generalChannel = member.guild.channels.cache.get(generalChannelId);

        if (!welcomeChannel) {
            console.error("Le canal de bienvenue est introuvable.");
            return;
        }

        if (!generalChannel) {
            console.error("Le canal général est introuvable.");
            return;
        }

        // Création de l'embed de bienvenue pour le salon "welcome"
        const welcomeEmbed = new EmbedBuilder()
            .setColor(config.embedColor)
            .setTitle(`${member.guild.name}`)
            .setDescription(`Coucou <@${member.user.id}> ! Bienvenue à toi.  \n- Nous t'invitons à aller choisir tes rôles dans ${rolesChannelLink} si besoin.`)
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
            .setFooter({ text: `Nous sommes maintenant ${member.guild.memberCount} membres` })
            .setTimestamp();

        // Envoi de l'embed de bienvenue dans le salon "welcome"
        await welcomeChannel.send({
            content: `<@${member.user.id}>`,
            embeds: [welcomeEmbed]
        });
        console.log(`Message de bienvenue envoyé à ${member.user.tag} dans le salon welcome.`);

        // Création de l'embed pour le salon "général"
        const generalWelcomeEmbed = new EmbedBuilder()
            .setColor(config.embedColor)
            .setDescription(`**Veuillez accueillir <@${member.user.id}> comme il se doit!**`)
            .setTimestamp();

        // Envoi de l'embed dans le salon "général"
        await generalChannel.send({
            embeds: [generalWelcomeEmbed]
        });
        console.log(`Message de bienvenue envoyé à ${member.user.tag} dans le salon général.`);

        // Attribution automatique du rôle (si activé dans la config)
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
        console.error("Erreur lors de l'envoi des messages de bienvenue :", error);
    }
};