const { ApplicationCommandOptionType, Client, ChatInputCommandInteraction } = require("discord.js");
const sdConfig = require('../../../sdConfig.json');
const { steps_choices, cfg_choices, extensionConfigs } = require('../../../sdConfig.json');
const axios = require('axios');
const sharp = require('sharp');
const generateImage = require("../../utils/SD/generateImage");

module.exports = {
    //deleted: true,
    name: 'controlnet',
    description: 'Generates an image with ControlNet.',
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
            name: 'cn-model',
            description: 'Which ControlNet model to use.',
            required: true,
            type: ApplicationCommandOptionType.String,
            choices: extensionConfigs.controlnet.controlnetModels
        },
        {
            name: 'cn-image',
            description: 'Image to be processed in ControlNet.',
            required: true,
            type: ApplicationCommandOptionType.Attachment,
        },
        {
            name: 'steps',
            description: "How much time to spend generating.",
            required: false,
            type: ApplicationCommandOptionType.Integer,
            choices: steps_choices
        },
        {
            name: 'cfg',
            description: "How close the image should be to the prompt.",
            required: false,
            type: ApplicationCommandOptionType.Integer,
            choices: cfg_choices
        }
    ],

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     */
    callback: async (client, interaction) => {
        if (sdConfig.extensionConfigs.controlnet.enabled == false) {
            await interaction.reply({content: "Controlnet is disabled, you can enable it in the `sdConfig.json` file."});
            return;
        }

        const passedAttachment = interaction.options.get('cn-image').attachment;
        
        if (!["image/png", "image/jpg"].includes(passedAttachment.contentType)) { 
            //If not image
            await interaction.reply({content: "The file you provided is not an image. Please provide a jpg/png file.", ephemeral: true});
            return;
        }

        const controlnetModel = interaction.options.get('cn-model').value;
        let controlnetModule;

        for (const model of sdConfig.extensionConfigs.controlnet.controlnetModels) {
            if (model.value === controlnetModel) {
                controlnetModule = model.name.toLowerCase();
            }
        }

        let controlnetImageBase64;

        await axios.get(passedAttachment.url, { responseType: 'arraybuffer' })
            .then(response => response.data)
            .then(imageData => sharp(imageData).toBuffer())
            .then(buffer => buffer.toString('base64'))
            .then(base64String => controlnetImageBase64 = base64String)

        await generateImage(
            'sdapi/v1/txt2img',
            {
                prompt: interaction.options.get('prompt').value,
                negative_prompt: sdConfig.generationDefaults.defaultNegativePrompt,
                steps: interaction.options.get('steps')?.value || sdConfig.generationDefaults.defaultSteps,
                cfg_scale: interaction.options.get('cfg')?.value || sdConfig.generationDefaults.defaultCfg,
                alwayson_scripts: {
                    controlnet: {
                        args: [
                            {
                                input_image: controlnetImageBase64,
                                module: controlnetModule,
                                model: controlnetModel
                            }
                        ]
                    }
                }
            },
            interaction,
            {
                upscaleBtn: true,
                redoBtn: true
            }
        )
    },
};