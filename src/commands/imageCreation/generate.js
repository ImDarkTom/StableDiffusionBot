const { ApplicationCommandOptionType, Client, ChatInputCommandInteraction } = require('discord.js');
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
            name: 'basic',
            description: 'Generate an image.',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'prompt',
                    description: 'What to generate.',
                    required: true,
                    type: ApplicationCommandOptionType.String,
                },
                {
                    name: 'performance',
                    description: "What generation performance should be focused on.",
                    required: true,
                    type: ApplicationCommandOptionType.String,
                    choices: sdConfig.presets.performance
                }
            ]
        },
        {
            name: 'advanced',
            description: 'Fine-tune the generation parameters.',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'prompt',
                    description: 'What to generate.',
                    required: true,
                    type: ApplicationCommandOptionType.String
                },
                {
                    name: 'negative_prompt',
                    description: "What to avoid generating.",
                    required: false,
                    type: ApplicationCommandOptionType.String
                },
                {
                    name: 'seed',
                    description: "Used to randomise images. Using the same seed multiple times gives same results.",
                    required: false,
                    type: ApplicationCommandOptionType.Integer
                },
                {
                    name: 'width',
                    description: "Image width.",
                    required: false,
                    type: ApplicationCommandOptionType.Integer
                },
                {
                    name: 'height',
                    description: "Image height.",
                    required: false,
                    type: ApplicationCommandOptionType.Integer
                },
                {
                    name: 'steps',
                    description: "Number of sampling steps for the denoising process. More gives higher quality but also takes longer.",
                    required: false,
                    type: ApplicationCommandOptionType.Integer
                },
                {
                    name: 'cfg_scale',
                    description: "How much the model should stick to your prompt. Less = more creative, more = strictly follow prompt.",
                    required: false,
                    type: ApplicationCommandOptionType.Integer
                },
                {
                    name: 'sampler_name',
                    description: "Algorithm for the denoising process. Must be full name such as DPM++ 2M Karras, Euler a, DDIM, etc.",
                    required: false,
                    type: ApplicationCommandOptionType.String
                }
            ]
        }
    ],

    /**
     * 
     * @param {Client} _client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    callback: async (_client, interaction) => {
        const commandOptions = interaction.options;
        const getCommandOption = (key) => commandOptions.get(key)?.value;

        const prompt = getCommandOption('prompt'); //Universally used

        const subcommand = commandOptions.getSubcommand();

        if (subcommand == "basic") {
            const performance_setting = getCommandOption('performance');
            const [preset_steps, preset_sampler, preset_cfg_scale] = performance_setting.split(',');

            await generateImage(
                'sdapi/v1/txt2img',
                {
                    prompt: prompt,
                    negative_prompt: sdConfig.generationDefaults.defaultNegativePrompt,
                    steps: preset_steps,
                    cfg_scale: preset_cfg_scale,
                    sampler_name: preset_sampler
                },
                interaction, 
                {
                    upscaleBtn: true,
                    redoBtn: true
                }
            );
        } else {
            //Advanced
            await generateImage(
                'sdapi/v1/txt2img',
                {
                    prompt: prompt,
                    negative_prompt: getCommandOption('negative_prompt'),
                    seed: getCommandOption('seed'),
                    width: getCommandOption('width'),
                    height: getCommandOption('height'),
                    steps: getCommandOption('steps'),
                    cfg_scale: getCommandOption('cfg_scale'),
                    sampler_name: getCommandOption('sampler_name')
                },
                interaction, 
                {
                    upscaleBtn: true,
                    redoBtn: true
                }
            );
        }
    }
};