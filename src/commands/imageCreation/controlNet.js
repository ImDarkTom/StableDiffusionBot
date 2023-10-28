const { ApplicationCommandOptionType } = require("discord.js");
const sdConfig = require('../../../sdConfig.json');
const { steps_choices, cfg_choices, extensionConfigs } = require('../../../sdConfig.json');
const sendRequest = require("../../utils/SD/sendRequest");
const progressUpdater = require('../../utils/SD/progressUpdater');
const createImageEmbed = require('../../utils/SD/createImageEmbed');
const axios = require('axios');
const sharp = require('sharp');

module.exports = {
    //deleted: true,
    name: 'controlnet',
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
            name: 'cn-model',
            description: 'Which ControlNet model to use.',
            required: true,
            type: ApplicationCommandOptionType.String,
            choices: extensionConfigs.controlnet.controlnetModels
        },
        {
            name: 'cn-image',
            description: 'Image to be processed in controlnet.',
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
            description: "How much creative freedom when generating.",
            required: false,
            type: ApplicationCommandOptionType.Integer,
            choices: cfg_choices
        }
    ],

    callback: async (client, interaction) => {

        if (sdConfig.extensionConfigs.controlnet.enabled == false) {
            await interaction.reply({content: "Controlnet is disabled, you can enable it in the `sdConfig.json` file."});
            return;
        }

        const cnAttachment = interaction.options.get('cn-image').attachment;
        
        if (["image/png", "image/jpg"].indexOf(cnAttachment.contentType) < 0) { 
            //If not image
            await interaction.reply({content: "The file you provided is not an image. Please provide a jpg/png file."});
            return;
        }

        await interaction.reply({content: "Waiting for Stable Diffusion..."});

        const cnModel = interaction.options.get('cn-model').value;
        let cnModule;

        for (const model of sdConfig.controlnetModels) {
            if (model.value === cnModel) {
                cnModule = model.name.toLowerCase();
            }
        }

        let cnImageB64;

        await axios.get(cnAttachment.url, { responseType: 'arraybuffer' })
            .then(response => response.data)
            .then(imageData => sharp(imageData).toBuffer())
            .then(buffer => buffer.toString('base64'))
            .then(base64String => cnImageB64 = base64String)

        const imagePromise = sendRequest('sdapi/v1/txt2img', {
            prompt: interaction.options.get('prompt').value,
            negative_prompt: sdConfig.generationDefaults.defaultNegativePrompt,
            steps: interaction.options.get('steps')?.value || sdConfig.generationDefaults.defaultSteps,
            cfg_scale: interaction.options.get('cfg')?.value || sdConfig.generationDefaults.defaultCfg,
            alwayson_scripts: {
                controlnet: {
                    args: [
                        {
                            input_image: cnImageB64,
                            module: cnModule,
                            model: cnModel
                        }
                    ]
                }
            }
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