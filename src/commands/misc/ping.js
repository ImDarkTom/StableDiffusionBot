const { Client, ChatInputCommandInteraction } = require("discord.js");

module.exports = {
    name: 'ping',
    description: 'Pong! Checks the bot ping.',
    // devOnly: Boolean,
    testOnly: true,
    // options: Object[],
    // deleted: Boolean,

    /**
     * 
     * @param {Client} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    callback: (client, interaction) => {
        interaction.reply(`Pong! ${client.ws.ping}ms`);
    },
};