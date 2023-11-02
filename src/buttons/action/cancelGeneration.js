//@ts-check
const { ButtonInteraction, Client } = require("discord.js");
const sendRequest = require("../../utils/SD/sendRequest");

module.exports = {
    id: 'cancelGeneration',
    ownerOnly: true,

    /**
     * Callback to cancel the generation of an image
     * @param {Client} _client 
     * @param {ButtonInteraction} interaction 
     */
    callback: async (_client, interaction) => {
        await sendRequest('sdapi/v1/interrupt', {}, "post");

        interaction.reply({content: "Generating cancelled.", ephemeral: true});
    },
};