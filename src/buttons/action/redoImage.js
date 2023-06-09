const createImageEmbed = require("../../utils/SD/createImageEmbed");
const imageDataFromEmbed = require("../../utils/SD/imageDataFromEmbed");
const sendRequest = require("../../utils/SD/sendRequest");
const sdConfig = require('../../../sdConfig.json');

module.exports = {
    id: 'redoImage',
    ownerOnly: false,

    callback: async (client, interaction) => {
        interaction.deferReply();

        const originalImageData = await imageDataFromEmbed(interaction.message.embeds[0]);

        const imageData = await sendRequest('txt2img', {
            prompt: originalImageData.prompt,
            negative_prompt: sdConfig.defaultNegativePrompt,
            steps: originalImageData.steps,
            cfg_scale: originalImageData.cfg_scale
        });

        await interaction.editReply(await createImageEmbed(imageData, {
            saveBtn: true,
            upscaleBtn: true,
            redoBtn: true
        }));
    },
};