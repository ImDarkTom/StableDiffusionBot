const createImageEmbed = require("../../utils/SD/createImageEmbed");
const imageDataFromEmbed = require("../../utils/SD/imageDataFromEmbed");
const sendRequest = require("../../utils/SD/sendRequest");
const sdConfig = require('../../../sdConfig.json');
const progressUpdater = require("../../utils/SD/progressUpdater");

module.exports = {
    id: 'redoImage',
    ownerOnly: false,

    callback: async (client, interaction) => {
        await interaction.reply({content: "Waiting for Stable Diffusion..."});

        const originalImageData = await imageDataFromEmbed(interaction.message.embeds[0]);

        const imagePromise = sendRequest('sdapi/v1/txt2img', {
            prompt: originalImageData.prompt,
            negative_prompt: sdConfig.generationDefaults.defaultNegativePrompt,
            steps: originalImageData.steps,
            cfg_scale: originalImageData.cfg_scale
        });

        const progressFinish = await progressUpdater(imagePromise, interaction);
        const finishedData = progressFinish[0];
        const imageData = progressFinish[1];

        await interaction.editReply(await createImageEmbed(imageData, {
            cancelled: finishedData.state.interrupted,
            saveBtn: true,
            upscaleBtn: true,
            redoBtn: true
        }, interaction.user));
    },
};