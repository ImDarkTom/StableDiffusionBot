const imageDataFromEmbed = require('../../utils/SD/imageDataFromEmbed');
const sdConfig = require('../../../sdConfig.json');
const generateImage = require("../../utils/SD/generateImage");

module.exports = {
    id: 'upscaleImage',
    ownerOnly: true,

    callback: async (client, interaction) => {
        const messageContent = String(interaction.message.content).split('-');

        const upscaleMultiplier = Number(interaction.customId.split('-')[2]);

        const originalMessageEmbed = (await interaction.channel.messages.fetch(messageContent[0])).embeds[0];
        const originalImageData = await imageDataFromEmbed(originalMessageEmbed, true);

        interaction.message.delete();

        let requestData;

        if (sdConfig.useUltimateSDUpscale == true) {
            requestData = {
                "init_images": [originalImageData.image], 
                "denoising_strength": 0.2,
                "prompt": originalImageData.prompt,
                "seed": -1,
                "steps": originalImageData.steps,
                "cfg_scale": originalImageData.cfg_scale,
                "script_args": [null, 512, 512, 8, 32, 64, 0.2, 16, Number(messageContent[1]), true, 1, false, 4, 0, 2, 512, 512, upscaleMultiplier],
                "script_name": "ultimate sd upscale"
            };
        } else {
            requestData = {
                "init_images": [originalImageData.image], 
                "denoising_strength": 0.2,
                "prompt": originalImageData.prompt,
                "seed": -1,
                "steps": originalImageData.steps,
                "cfg_scale": originalImageData.cfg_scale,
                "script_args": [null, 64, Number(messageContent[1]), upscaleMultiplier],
                "script_name": "sd upscale"
            };
        }

        await generateImage(
            'sdapi/v1/img2img',
            requestData,
            interaction,
            {
                upscaleBtn: false,
                redoBtn: false,
                additionalTitleText: `Upscaled to ${originalImageData.width*upscaleMultiplier}x${originalImageData.height*upscaleMultiplier} with upscaler value '${messageContent[1]}'`
            }
        );
    },
};