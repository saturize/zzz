const { ActivityType } = require('discord.js');
require('dotenv').config();

module.exports = async (oldMember, newMember) => {
    try {
        const guild = newMember.guild;
        const vanityID = '1305215473960489011';
        const vanityRole = guild.roles.cache.get(vanityID);
        const vanity = '.gg/saturize';

        if (!oldMember || !newMember) return;
        if (oldMember.status !== newMember.status) return;
        if (!guild || guild.id !== process.env.GUILD_ID) return;
        if (!vanityRole || vanityRole.deleted) return;

        let status = newMember.activities.map(a => a.state);
        const member = guild.members.cache.get(newMember.user.id);

        if (!member) return;

        if (newMember.guild.roles.cache.has(vanityRole)) {
            console.error(mainFade('vanity - .gg/saturize') + ` | @${member.user.tag}` + chalk.red` already ` + `has the role.`);
        } else {
            if (status[0] != null && status[0].includes(vanity)) {
                try {
                    await member.roles.add(vanityID);
        
                    //console.log(mainFade('vanity - .gg/saturize') + ` | @${member.user.tag}` +  chalk.green` has now ` + `the vanity in his status.`);
                } catch (error) {
                    console.error(`Error adding role: ${error}`);
                }
            } else {
                if (member.roles.cache.some((r) => r.id === vanityID)) {
                    try {
                        //console.error(mainFade('vanity - .gg/saturize') + ` | @${member.user.tag}` + chalk.red` removed ` + `the vanity in his status.`);
                        await member.roles.remove(vanityID);
        
                    } catch (error) {
                        console.error(`Error removing role: ${error}`);
                    }
                }
            }
        }
    } catch (error) {
        console.error("Erreur dans l'événement presenceUpdate :", error);
    }
};