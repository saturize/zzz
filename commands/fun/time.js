const { EmbedBuilder } = require('discord.js');
const path = require('path');
const config = require(path.join(__dirname, '../../config.json'));
const moment = require('moment-timezone');

exports.run = async (client, message, args) => {
    // UTC+06:00 TO UTC-06:00
    const timezones = [
        { offset: '-06:00', name: 'Central Standard Time', tz: 'America/Chicago' },
        { offset: '-05:00', name: 'Eastern Standard Time', tz: 'America/New_York' },
        { offset: '-04:00', name: 'Chile Time', tz: 'America/Santiago' },
        { offset: '-03:00', name: 'Argentina Time', tz: 'America/Argentina/Buenos_Aires' },
        { offset: '-02:00', name: 'South Georgia Time', tz: 'Atlantic/South_Georgia' },
        { offset: '-01:00', name: 'Azores Time', tz: 'Atlantic/Azores' },
        { offset: '+00:00', name: 'UTC', tz: 'Europe/London' },
        { offset: '+01:00', name: 'Central European Time', tz: 'Europe/Paris' },
        { offset: '+02:00', name: 'Eastern European Time', tz: 'Europe/Athens' },
        { offset: '+03:00', name: 'Moscow Time', tz: 'Europe/Moscow' },
        { offset: '+04:00', name: 'Dubai Time', tz: 'Asia/Dubai' },
        { offset: '+05:00', name: 'Pakistan Standard Time', tz: 'Asia/Karachi' },
        { offset: '+06:00', name: 'Bangladesh Standard Time', tz: 'Asia/Dhaka' },
        { offset: '+07:00', name: 'Indochina Time', tz: 'Asia/Ho_Chi_Minh' },
        { offset: '+08:00', name: 'China Standard Time', tz: 'Asia/Shanghai' },
        { offset: '+09:00', name: 'Japan Standard Time', tz: 'Asia/Tokyo' },
        { offset: '+10:00', name: 'Australian Eastern Standard Time', tz: 'Australia/Sydney' }
    ];

    const embed = new EmbedBuilder()
        .setTitle('Heure actuelle à travers le monde')
        .setColor(config.embedColor)

    timezones.forEach(tz => {
        const time = moment().tz(tz.tz).format('YYYY-MM-DD HH:mm:ss');
        embed.addFields({ name: `UTC${tz.offset} : ${tz.name}`, value: time });
    });

    message.channel.send({ embeds: [embed] });
};

exports.name = 'time';
exports.description = "Affiche les fuseaux horaires à travers le monde."