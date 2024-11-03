const { EmbedBuilder } = require('discord.js');
const config = require("./config.json");
const axios = require('axios');

let lastStream = null; // Variable pour stocker le dernier stream

async function checkLiveStatus(client) {
    try {
        const response = await axios.get(`https://api.twitch.tv/helix/streams?user_login=${process.env.TWITCH_CHANNEL_NAME}`, {
            headers: {
                'Client-ID': process.env.TWITCH_CLIENT_ID,
                'Authorization': `Bearer ${await getAccessToken()}` // Obtenir le token d'accès
            }
        });

        const streamData = response.data.data[0]; // Les données du stream

        if (streamData && streamData.id !== lastStream) {
            lastStream = streamData.id; // Met à jour le dernier stream
            notifyDiscord(client, streamData); // Envoie la notification sur Discord
        } else if (!streamData) {
            lastStream = null; // Réinitialise si le stream n'est pas en direct
        }
    } catch (error) {
        console.error('Error fetching Twitch stream status:', error);
    }
}

async function getAccessToken() {
    const response = await axios.post('https://id.twitch.tv/oauth2/token', null, {
        params: {
            client_id: process.env.TWITCH_CLIENT_ID,
            client_secret: process.env.TWITCH_CLIENT_SECRET,
            grant_type: 'client_credentials'
        }
    });
    return response.data.access_token;
}

function notifyDiscord(client, streamData) {
    const channel = client.channels.cache.get(process.env.DISCORD_CHANNEL_ID);
    if (channel) {
        channel.send(`📢 Je suis en live !!`).then(() => {
            const embed = new EmbedBuilder()
                .setColor('#9146FF')
                .setAuthor({
                    name: `${process.env.TWITCH_CHANNEL_NAME} est en live sur Twitch!`,
                    iconURL: `https://static-cdn.jtvnw.net/jtv_user_pictures/${process.env.TWITCH_CHANNEL_NAME}.png`, // Photo de profil de la chaîne
                })
                .setTitle(`${streamData.title}`)
                .setURL(`https://www.twitch.tv/${process.env.TWITCH_CHANNEL_NAME}`)

                .addFields(
                    { name: 'Jeu', value:`${streamData.game_name}`, inline: false }
                )
                .setImage(streamData.thumbnail_url.replace('{width}', '1280').replace('{height}', '720')) // Miniature
                .setTimestamp();

            channel.send({ embeds: [embed] });
        }).catch(console.error)
    } else {
        console.error('Channel not found:', process.env.DISCORD_CHANNEL_ID);
    }
}

module.exports = {
    checkLiveStatus
};