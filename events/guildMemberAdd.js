const { EmbedBuilder, Client, GatewayIntentBits } = require('discord.js');
const path = require('path');
const configPath = path.join(__dirname, '../config.json');
const config = require(configPath);

module.exports = async (client, member) => {
    try {
        
        // WELCOME
        console.log(`Nouvel utilisateur: ${member.user.tag} a rejoint le serveur ${member.guild.name}`);

        const welcomeChannelId = '1408995514023805070'; // welcome
        const generalChannelId = '1408990731426599024'; // général

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

        // embed welcome
        const welcomeEmbed = new EmbedBuilder()
            .setColor(config.embedColor)
            .setTitle(`${member.guild.name}`)
            .setDescription(`Coucou <@${member.user.id}> ! Bienvenue à toi.\n
                
                > J'espère que tu vas être sage, pas vrai ?
                `)
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

        const sentMessage = await generalChannel.send({
            embeds: [generalWelcomeEmbed]
            });
            console.log(`Message de bienvenue envoyé à ${member.user.tag} dans le salon général.`);

            // 5MIN SUPP
            setTimeout(() => {sentMessage.delete().catch(err => {
                console.error('Erreur lors de la suppression du message de bienvenue :', err);});
            }, 5 * 60 * 1000); // 5 minutes en millisecondes

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