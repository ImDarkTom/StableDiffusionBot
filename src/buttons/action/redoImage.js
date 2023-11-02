//@ts-check
const imageDataFromEmbed = require("../../utils/SD/imageDataFromEmbed");
const sdConfig = require('../../../sdConfig.json');
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

        await generateImage(
            'sdapi/v1/txt2img',
            {
                prompt: originalImageData.prompt,
                negative_prompt: sdConfig.generationDefaults.defaultNegativePrompt,
                steps: originalImageData.steps,
                cfg_scale: originalImageData.cfg_scale
            },
            interaction,
            {
                upscaleBtn: true,
                redoBtn: true
            }
        );
    },
};