const { ApplicationCommandOptionType } = require('discord.js');
const sendRequest = require('../../utils/SD/sendRequest');
const sdConfig = require('../../../sdConfig.json');
const createImageEmbed = require('../../utils/SD/createImageEmbed');

module.exports = {
    //deleted: true,
    name: 'generate',
    description: 'Generates an image.',
    // devOnly: Boolean,
    // testOnly: Boolean,
    options: [
        {
            name: 'prompt',
            description: 'What to generate.',
            required: true,
            type: ApplicationCommandOptionType.String,
        }
    ],

    callback: async (client, interaction) => {
        await interaction.deferReply();

        const imageData = await sendRequest('txt2img', {
            prompt: interaction.options.get('prompt').value,
            negative_prompt: sdConfig.defaultNegativePrompt,
            steps: 20
        });

        await interaction.editReply(await createImageEmbed(imageData, {
            saveBtn: true,
            upscaleBtn: true
        }));
    },
};