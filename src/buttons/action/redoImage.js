//@ts-check
const imageDataFromEmbed = require("../../utils/SD/imageDataFromEmbed");
const generateImage = require("../../utils/SD/generateImage");
const { Client, ButtonInteraction } = require("discord.js");

module.exports = {
    id: 'redoImage',
    ownerOnly: false,

    /**
     * 
     * @param {Client} _client 
     * @param {ButtonInteraction} interaction 
     */
    callback: async (_client, interaction) => {
        const originalImageData = await imageDataFromEmbed(interaction.message.embeds[0]);

        originalImageData.seed = -1;

        await generateImage(
            'sdapi/v1/txt2img',
            originalImageData,
            interaction,
            {
                upscaleBtn: true,
                redoBtn: true
            }
        );
    },
};