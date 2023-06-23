const sendRequest = require("../../utils/SD/sendRequest");
const imageDataFromEmbed = require('../../utils/SD/imageDataFromEmbed');
const createImageEmbed = require("../../utils/SD/createImageEmbed");
const progressUpdater = require("../../utils/SD/progressUpdater");
const sdConfig = require('../../../sdConfig.json');

module.exports = {
    id: 'upscaleImg',
    ownerOnly: true,

    callback: async (client, interaction) => {
        const messageContent = String(interaction.message.content).split('-');

        await interaction.reply({content: "Waiting for Stable Diffusion..."});

        const upscaleMultiplier = Number(interaction.customId.split('-')[2]);

        const originalMessageEmbed = (await interaction.channel.messages.fetch(messageContent[0])).embeds[0];
        const originalImageData = await imageDataFromEmbed(originalMessageEmbed, true);

        interaction.message.delete();

        let imagePromise;

        if (sdConfig.useUltimateSDUpscale == true) {
            imagePromise = sendRequest('sdapi/v1/img2img', {
                "init_images": [originalImageData.image], 
                "denoising_strength": 0.2,
                "prompt": originalImageData.prompt,
                "seed": -1,
                "steps": originalImageData.steps,
                "cfg_scale": originalImageData.cfg_scale,
                "script_args": [null, 512, 512, 8, 32, 64, 0.2, 16, Number(messageContent[1]), true, 1, false, 4, 0, 2, 512, 512, upscaleMultiplier],
                "script_name": "ultimate sd upscale"
            });
        } else {
            imagePromise = sendRequest('sdapi/v1/img2img', {
                "init_images": [originalImageData.image], 
                "denoising_strength": 0.2,
                "prompt": originalImageData.prompt,
                "seed": -1,
                "steps": originalImageData.steps,
                "cfg_scale": originalImageData.cfg_scale,
                "script_args": [null, 64, Number(messageContent[1]), upscaleMultiplier],
                "script_name": "sd upscale"
            });
        }

        const progressFinish = await progressUpdater(imagePromise, interaction);
        const finishedData = progressFinish[0];
        const imageData = progressFinish[1];

        await interaction.editReply(await createImageEmbed(imageData, {
            cancelled: finishedData.state.interrupted,
            saveBtn: true,
            upscaleBtn: false,
            redoBtn: false
        }, interaction.user, `Upscaled to ${originalImageData.width*upscaleMultiplier}x${originalImageData.height*upscaleMultiplier} with upscaler value '${messageContent[1]}'`));
    },
};