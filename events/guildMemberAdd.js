const { Client, GatewayIntentBits } = require('discord.js');
const path = require('path');
const fs = require('fs');
const configPath = path.join(__dirname, '../config.json');
const config = require(configPath);

module.exports = (client) => {
    client.on('guildMemberAdd', async (member) => {
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