const { ApplicationCommandOptionType, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const axios = require('axios');
const sharp = require('sharp');

//SD
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

function getAutoCFG(len) {
    let cfg;
    if (len >= 75) {
        cfg = 11;
    } else if (len == 0) {
        cfg = 7;
    } else {
        cfg = 4 + ((75 / 11.5) * 2);
        cfg = Math.round(cfg);
    }
    return cfg;
}

//Command
module.exports = { 
    name: 'generate',
    description: 'Generates an image from a prompt.',
    // devOnly: Boolean,
    // testOnly: Boolean,
    options: [
        {
            name: 'prompt',
            description: 'What it should generate.',
            type: ApplicationCommandOptionType.String,
            required: true,
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
            name: 'prompt-strength',
            description: 'How much the prompt is followed. Higher prompt strengths are good for more detailed descriptions.',
            type: ApplicationCommandOptionType.Number,
            choices: [
                {
                    name: 'auto',
                    value: -1,
                    default: true
                },
                {
                    name: 'low',
                    value: 4
                },
                {
                    name: 'moderate',
                    value: 7
                },
                {
                    name: 'high',
                    value: 9
                },
                {
                    name: 'v-high',
                    value: 13
                }
            ]
        },
        {
            name: 'aspect-ratio',
            description: 'Aspect ratio.',
            type: ApplicationCommandOptionType.String,
            choices: [
                {
                    name: 'square',
                    value: '512x512',
                    default: true
                },
                {
                    name: 'landscape',
                    value: '640x360'
                },
                {
                    name: 'portrait',
                    value: '360x640'
                }
            ],
            required: false
        },
        {
            name: 'seed',
            description: 'The image seed. Random by default.',
            type: ApplicationCommandOptionType.Integer,
            required: false
        }
    ],

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

        interaction.reply({ embeds: [preEmbed] });


        const prompt = interaction.options.get('prompt').value;
        const mode = interaction.options.get('mode').value;
        let aspect;

        if (interaction.options.get("aspect-ratio")?.value != null) {
            aspect = interaction.options.get("aspect-ratio").value;
        } else {
            aspect = '512x512';
        }

        let cfgScale;

        if (interaction.options.get("prompt-strength") != null) {
            cfgScale = Number(interaction.options.get("prompt-strength").value);
        } else if (interaction.options.get('prompt-strength') == null || interaction.options.get('prompt-strength')?.value == -1) {
            cfgScale = getAutoCFG(Number(prompt.length));
        }

        console.log(cfgScale);

        const steps = Number(mode.split(',')[1]);
        const sampler = mode.split(',')[0];
        const width = Number(aspect.split('x')[0]);
        const height = Number(aspect.split('x')[1]);
        let seed;

        if (interaction.options.get('seed') != null) {
            seed = interaction.options.get('seed').value;
        } else {
            seed = Math.floor(Math.random() * (999999999 - 100000000 + 1)) + 100000000;
        }

        const image = await postImgReq('txt2img', {
            prompt: prompt,
            steps: steps,
            sampler_index: sampler,
            seed: seed,
            width: width,
            height: height,
            styles: ["nai v2", "HD"],
            cfg_scale: cfgScale
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