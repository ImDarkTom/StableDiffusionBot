const { ApplicationCommandOptionType, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const axios = require('axios');
const sharp = require('sharp');

//SD
function adjustDimensions(width, height) {
    const maxPixels = 263000; // maximum number of pixels allowed

    const numPixels = width * height;
    if (numPixels <= maxPixels) {
        // If the number of pixels is within the limit, return the original dimensions
        return [width, height];
    } else {
        // If the number of pixels exceeds the limit, adjust the dimensions while keeping the aspect ratio the same
        const ratio = width / height;
        const newWidth = Math.sqrt(maxPixels * ratio);
        const newHeight = maxPixels / newWidth;
        return [Math.round(newWidth), Math.round(newHeight)];
    }
}

async function postImgReq(type, data) {
    try {
        const response = await axios.post(`http://127.0.0.1:7860/sdapi/v1/${type}`, data);
        const image = response.data.images[0];
        return image;
    } catch (error) {
        console.log(error);
    }
}

async function getImageProgress() {
    try {
        const response = await axios.get('http://127.0.0.1:7860/sdapi/v1/progress');
        const data = response.data;
        return data;
    } catch (error) {
        console.log(error);
    }
}

//Command
module.exports = {
    name: 'fromimg',
    description: 'Generate an image from an image.',
    options: [
        {
            name: 'image',
            description: 'Image to generate from',
            type: ApplicationCommandOptionType.Attachment,
            required: true
        },
        {
            name: 'prompt',
            description: 'What it should generate.',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: 'image-strength',
            description: 'How much it should go off the given image.',
            type: ApplicationCommandOptionType.Number,
            required: true,
            choices: [
                {
                    name: 'very-low',
                    value: '0.20'
                },
                {
                    name: 'low',
                    value: '0.35',
                },
                {
                    name: 'moderate',
                    value: '0.50',
                    default: true
                },
                {
                    name: 'high',
                    value: '0.65'
                },
                {
                    name: 'very-high',
                    value: '0.80',
                }
            ]
        },
        {
            name: 'mode',
            description: 'Preset for Sampler and Steps.',
            type: ApplicationCommandOptionType.String,
            choices: [
                {
                    name: 'default',
                    value: 'Euler a,20',
                    default: true
                },
                {
                    name: 'fast',
                    value: 'DDIM,8'
                },
                {
                    name: 'detailed',
                    value: 'LMS Karras,80'
                }
            ],
            required: true
        },
        {
            name: 'seed',
            description: 'The image seed. Random by default.',
            type: ApplicationCommandOptionType.Integer,
            required: false
        }
    ],
    // devOnly: Boolean,
    // testOnly: Boolean,


    callback: async (client, interaction) => {
        const progress = await getImageProgress();
        const jobCount = progress.state.job_count;
        let preEmbed;
        if (jobCount > 0) {
            preEmbed = new EmbedBuilder()
                .setTitle('In queue...')
                .setDescription(`Waiting for ${jobCount} image(s) to be generated...`)
                .setColor('Orange')

        } else {
            preEmbed = new EmbedBuilder()
                .setTitle('Generating...')
                .setDescription('Waiting for generation to finish...')
                .setColor('Greyple')
        }

        const givenAttachment = interaction.options.get('image').attachment;

        if (givenAttachment.contentType.split('/')[0] != 'image') {
            interaction.reply({ content: "The file you have selected is not of a valid image format. Please select a file with a valid image format such as JPG or PNG.", ephemeral: true });
            return;
        }

        interaction.reply({ embeds: [preEmbed] });

        const givenImageReq = await axios.get(givenAttachment.url, { responseType: 'arraybuffer' });
        const givenImageB64 = Buffer.from(givenImageReq.data).toString('base64');

        const [adjustedWidth, adjustedHeight] = adjustDimensions(givenAttachment.width, givenAttachment.height);

        const imageStrength = interaction.options.get('image-strength').value;
        const prompt = interaction.options.get('prompt').value;
        const mode = interaction.options.get('mode').value;

        const steps = Number(mode.split(',')[1]);
        let seed;

        if (interaction.options.get('seed') != null) {
            seed = interaction.options.get('seed').value;
        } else {
            seed = Math.floor(Math.random() * (999999999 - 100000000 + 1)) + 100000000;
        }

        const image = await postImgReq('img2img', {
            init_images: [
                givenImageB64
            ],
            prompt: prompt,
            steps: steps,
            seed: seed,
            width: adjustedWidth,
            height: adjustedHeight,
            styles: ["nai v2", "HD"],
            denoising_strength: 1 - (imageStrength)
        });

        const buffer = Buffer.from(image, 'base64');
        const imageObject = await sharp(buffer).png().toBuffer();
        const imageAttachment = new AttachmentBuilder(imageObject, { name: 'output.png' });

        let postEmbed = new EmbedBuilder()
            .setTitle(`Request by ${interaction.user.tag}`)
            .setDescription(`"${prompt}"`)
            .setColor('Blurple')
            .setImage('attachment://output.png')
            .setFooter({ text: String(seed) })

        interaction.editReply({ embeds: [postEmbed], files: [imageAttachment] });
    },
};