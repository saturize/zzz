const { ActivityType } = require('discord.js');

module.exports = async (oldMember, newMember) => {
    try {
        // Vérification de l'existence de newMember et de la guilde
        if (!newMember || !newMember.guild) {
            console.error('Erreur : newMember ou newMember.guild est indéfini');
            return; // Sortir si newMember ou newMember.guild est indéfini
        }

        // Récupérer l'ID du rôle à attribuer
        const customRoleId = '1305215473960489011'; // Remplacez ceci par l'ID réel de votre rôle
        const customRole = newMember.guild.roles.cache.get(customRoleId);

        if (!customRole) {
            console.error("Le rôle pour le statut est introuvable.");
            return; // Arrêter si le rôle n'est pas trouvé
        }

        // Vérifier que newMember a des activités de type personnalisé
        const customStatus = newMember.presence?.activities.find(activity => activity.type === ActivityType.Custom);

        if (!customStatus) {
            console.log(`Aucun statut personnalisé détecté pour ${newMember.user.tag}`);
            return; // Sortir si aucun statut personnalisé n'est trouvé
        }

        // Vérification si le statut personnalisé contient ".gg/saturize" ou "/saturize"
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