const sendRequest = require("../../utils/SD/sendRequest");
const imageDataFromEmbed = require('../../utils/SD/imageDataFromEmbed');
const createImageEmbed = require("../../utils/SD/createImageEmbed");

module.exports = {
    id: 'upscaleImg2x',
    ownerOnly: true,

    callback: async (client, interaction) => {
        await interaction.deferReply();

        const originalMessageEmbed = (await interaction.channel.messages.fetch(interaction.message.content)).embeds[0];
        const originalImageData = await imageDataFromEmbed(originalMessageEmbed, true);

        interaction.message.delete();

        const imageData = await sendRequest('img2img', {
            "init_images": [originalImageData.image], 
            "denoising_strength": 0.2,
            "prompt": originalImageData.prompt,
            "seed": -1,
            "steps": 20,
            "cfg_scale": 7,
            "width": 64,
            "height": 64,
            "script_args": ["", 512, 512, 8, 32, 64, 0.2, 16, 6, true, 1, false, 4, 0, 2, 512, 512, 2],
            "script_name": "ultimate sd upscale"
        });

        await interaction.editReply(await createImageEmbed(imageData, {
            saveBtn: true,
            upscaleBtn: false,
            redoBtn: false
        }, interaction.user, `Upscaled to ${originalImageData.width*2}x${originalImageData.height*2}`));
    },
};