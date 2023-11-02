const { ApplicationCommandOptionType } = require('discord.js');
const sdConfig = require('../../../sdConfig.json');
const generateImage = require('../../utils/SD/generateImage');

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
            description: "How close the image should be to the prompt.",
            required: false,
            type: ApplicationCommandOptionType.Integer,
            choices: sdConfig.cfg_choices
        }
    ],

    callback: async (client, interaction) => {
        await generateImage(
            'sdapi/v1/txt2img',
            {
                prompt: interaction.options.get('prompt').value,
                negative_prompt: sdConfig.generationDefaults.defaultNegativePrompt,
                steps: interaction.options.get('steps')?.value || sdConfig.generationDefaults.defaultSteps,
                cfg_scale: interaction.options.get('cfg')?.value || sdConfig.generationDefaults.defaultCfg
            },
            interaction, 
            {
                upscaleBtn: true,
                redoBtn: true
            }
        );
    },
};