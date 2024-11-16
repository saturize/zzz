require('dotenv').config();
const { ActivityType, GatewayIntentBits } = require('discord.js');

// Assurez-vous que votre client Discord a les intentions appropriées
// Inclure GatewayIntentBits.GuildPresences dans les intents du client pour lire les statuts
module.exports = async (oldMember, newMember) => {
    try {
        const guildId = process.env.GUILD_ID;
        // Vérification de l'existence de newMember et de newMember.guild
        if (!newMember || !newMember.guild) {
            console.error('Erreur : newMember ou newMember.guild est indéfini');
            return; // Sortir si newMember ou newMember.guild est indéfini
        }
        
        if (newMember.guild.id !== guildId) return;

        // Vérifier si le membre a une présence
        if (!newMember.presence || !newMember.presence.activities.length) {
            console.log(`${newMember.user.tag} n'a pas de présence définie ou d'activités.`);
            return; // Sortir si le membre est hors ligne ou n'a aucune activité
        }

        // Récupérer l'ID du rôle à attribuer
        const customRoleId = '1305215473960489011'; // Remplacez ceci par l'ID réel de votre rôle
        const customRole = newMember.guild.roles.cache.get(customRoleId);

        if (!customRole) {
            console.error("Le rôle pour le statut est introuvable.");
            return; // Arrêter si le rôle n'est pas trouvé
        }

        // Vérifier les activités du membre, en particulier le statut personnalisé
        const customStatus = newMember.presence.activities.find(activity => activity.type === ActivityType.Custom);

        if (!customStatus) {
            console.log(`Aucun statut personnalisé détecté pour ${newMember.user.tag}`);
            return; // Sortir si aucun statut personnalisé n'est trouvé
        }

        // Vérification du contenu du statut personnalisé
        if (customStatus.state && (customStatus.state.includes('.gg/saturize') || customStatus.state.includes('/saturize'))) {
            // Si le membre n'a pas déjà le rôle, on l'ajoute
            if (!newMember.roles.cache.has(customRoleId)) {
                await newMember.roles.add(customRole);
                console.log(`Rôle ajouté à ${newMember.user.tag} pour son statut personnalisé.`);
            }
        } else {
            // Si le statut ne correspond pas, on retire le rôle
            if (newMember.roles.cache.has(customRoleId)) {
                await newMember.roles.remove(customRole);
                console.log(`Rôle retiré à ${newMember.user.tag} car son statut ne correspond plus.`);
            }
        }
    } catch (error) {
        console.error("Erreur dans l'événement presenceUpdate :", error);
    }
};