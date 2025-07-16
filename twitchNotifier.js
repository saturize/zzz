const { EmbedBuilder } = require('discord.js');
const config = require("./config.json");
const axios = require('axios');

let lastStream = null;

async function checkLiveStatus(client) {
    try {
        const response = await axios.get(`https://api.twitch.tv/helix/streams?user_login=${process.env.TWITCH_CHANNEL_NAME}`, {
            headers: {
                'Client-ID': process.env.TWITCH_CLIENT_ID,
                'Authorization': `Bearer ${await getAccessToken()}` // get access token
            }
        });

        const streamData = response.data.data[0];

        if (streamData && streamData.id !== lastStream) {
            lastStream = streamData.id; // update last stream w new one
            notifyDiscord(client, streamData); // send on dc
        } else if (!streamData) {
            lastStream = null; // if no stream then reinit
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

async function notifyDiscord(client, streamData) {
    const channel = client.channels.cache.get(process.env.DISCORD_CHANNEL_ID);
    const guild = client.guilds.cache.get(process.env.GUILD_ID);
    const roleId = '1383175228883996744';

    if (channel && guild) {
        const role = guild.roles.cache.get(roleId);

        if (!role) {
            console.error(`Rôle non trouvé avec l'ID : ${roleId}`);
            return;
        }

        const embed = new EmbedBuilder()
            .setColor('#9146FF')
            .setAuthor({
                name: `${process.env.TWITCH_CHANNEL_NAME} est en live sur Twitch!`,
                // iconURL: `https://static-cdn.jtvnw.net/jtv_user_pictures/${process.env.TWITCH_CHANNEL_NAME}.png`,
            })
            .setTitle(`${streamData.title}`)
            .setURL(`https://www.twitch.tv/${process.env.TWITCH_CHANNEL_NAME}`)
            .addFields({ name: 'Jeu', value: `${streamData.game_name}`, inline: false })
            .setImage(streamData.thumbnail_url.replace('{width}', '1280').replace('{height}', '720'))
            .setFooter({ text: `ｓａｔｕｒｉｚｅ` })
            .setTimestamp();

        channel.send({
            content: `📢 Je suis en live !! ||<@&${roleId}>||`,
            embeds: [embed]
        });
    } else {
        console.error('Channel ou guilde non trouvés');
    }
}

module.exports = {
    checkLiveStatus
};