//@ts-check
const { ButtonInteraction, Client } = require("discord.js");

module.exports = {
    id: 'cancelUpscale',
    ownerOnly: true,

    /**
     * 
     * @param {Client} _client 
     * @param {ButtonInteraction} interaction 
     */
    callback: async (_client, interaction) => {
        await interaction.message.delete();
    },
};