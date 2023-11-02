const imageDataFromEmbed = require("../../utils/SD/imageDataFromEmbed");
const sdConfig = require('../../../sdConfig.json');
const generateImage = require("../../utils/SD/generateImage");

module.exports = {
    id: 'redoImage',
    ownerOnly: false,

    callback: async (client, interaction) => {
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