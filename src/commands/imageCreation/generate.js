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
        },
        {
            name: 'steps',
            description: "How much time to spend generating.",
            required: false,
            type: ApplicationCommandOptionType.Integer,
            choices: sdConfig.steps_choices
        },
        {
            name: 'cfg',
            description: "How much creative freedom when generating.",
            required: false,
            type: ApplicationCommandOptionType.Integer,
            choices: sdConfig.cfg_choices
        }
    ],

    callback: async (client, interaction) => {
        await interaction.deferReply();

        const imageData = await sendRequest('sdapi/v1/txt2img', {
            prompt: interaction.options.get('prompt').value,
            negative_prompt: sdConfig.defaultNegativePrompt,
            steps: interaction.options.get('steps')?.value || 20,
            cfg_scale: interaction.options.get('cfg')?.value || 7
        });

        await interaction.editReply(await createImageEmbed(imageData, {
            saveBtn: true,
            upscaleBtn: true,
            redoBtn: true
        }, interaction.user));
    },
};