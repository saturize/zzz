const { EmbedBuilder, Client, GatewayIntentBits } = require('discord.js');
const path = require('path');
const configPath = path.join(__dirname, '../config.json');
const config = require(configPath);

module.exports = async (client, member) => {
    try {
        // WELCOME
        console.log(`Nouvel utilisateur: ${member.user.tag} a rejoint le serveur ${member.guild.name}`);

        const welcomeChannelId = '1302408288738213898'; // welcome
        const generalChannelId = '1302407890899963914'; // général
        const rolesChannelLink = 'https://discord.com/channels/1284920847441858703/1305170147505340416';

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

        // embed elwcome
        const welcomeEmbed = new EmbedBuilder()
            .setColor(config.embedColor)
            .setTitle(`${member.guild.name}`)
            .setDescription(`Coucou <@${member.user.id}> ! Bienvenue à toi.  \n- Nous t'invitons à aller choisir tes rôles dans ${rolesChannelLink} si besoin.`)
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
            .setFooter({ text: `Nous sommes maintenant ${member.guild.memberCount} membres` })
            .setTimestamp();

        await welcomeChannel.send({
            content: `<@${member.user.id}>`,
            embeds: [welcomeEmbed]
        });
        console.log(`Message de bienvenue envoyé à ${member.user.tag} dans le salon welcome.`);

        // embed general
        const generalWelcomeEmbed = new EmbedBuilder()
            .setColor(config.embedColor)
            .setDescription(`**Veuillez accueillir <@${member.user.id}> comme il se doit!**`)
            .setTimestamp();

        await generalChannel.send({
            embeds: [generalWelcomeEmbed]
        });
        console.log(`Message de bienvenue envoyé à ${member.user.tag} dans le salon général.`);

        // AUTOROLE
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