const { Client } = require("discord.js");

/**
 * 
 * @param {Client} client 
 */
module.exports = (client) => {
    console.log(`${client.user.tag} is online.`);
};