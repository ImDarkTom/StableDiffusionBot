const { EmbedBuilder, Client, StringSelectMenuInteraction, AttachmentBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const sendRequest = require('../../utils/SD/sendRequest');
const { default:axios } = require('axios');
const sharp = require('sharp');
const sdConfig = require('../../../sdConfig.json');

module.exports = {
    id: 'modelDropdown',
    ownerOnly: true,

    /**
     * 
     * @param {Client} _client 
     * @param {StringSelectMenuInteraction} interaction 
     */
    callback: async (_client, interaction) => {
        const selectedModelName = interaction.values[0];

        const allModelsInfo = await sendRequest('sdapi/v1/sd-models', {}, "get");
        const selectedModelInfo = allModelsInfo.filter((model) => model.model_name == selectedModelName)[0];
        const modelFileName = selectedModelInfo.filename;

        //Get model thumbnail
        let thumbnailImageBuffer, thumbnailFileExtension;
        const fileNameNoExt = modelFileName.substring(0, modelFileName.lastIndexOf('.'));
        for (const fileExtension of ['png', 'jpg', 'jpeg', 'webp', 'gif']) {
            const generatedImageFileName = `${fileNameNoExt}.${fileExtension}`;
            const generatedUrl = `${sdConfig.baseUrl}:${sdConfig.port}/sd_extra_networks/thumb?filename=${generatedImageFileName}`;

            try {
                const response = await axios.get(generatedUrl, { responseType: 'arraybuffer'});
        
                if (response.status === 404) {
                    continue;
                }
        
                thumbnailImageBuffer = sharp(response.data);
                thumbnailFileExtension = fileExtension;
                break;

            } catch (error) {
                if (!(error.response && error.response.status == 404)) {
                    //If not 404
                    console.error(`Error fetching ${generatedUrl}: ${error.message}`);
                }
            }
        }

        if (thumbnailImageBuffer == undefined) {
            const response = await axios.get(`${sdConfig.baseUrl}:${sdConfig.port}/file=html/card-no-preview.png`, { responseType: 'arraybuffer' });

            thumbnailImageBuffer = sharp(response.data);
            thumbnailFileExtension = "png";
        }

        const attachment = new AttachmentBuilder(thumbnailImageBuffer, {name: `thumbnail.${thumbnailFileExtension}`, description: ""});

        const embed = new EmbedBuilder()
            .setTitle(selectedModelInfo.model_name)
            .setDescription(selectedModelInfo.title)
            .setThumbnail(`attachment://thumbnail.${thumbnailFileExtension}`)
            .setColor('Aqua')

        const buttonRow = new ActionRowBuilder();

        const loadButton = new ButtonBuilder()
            .setCustomId('loadCheckpoint')
            .setLabel('Load Checkpoint')
            .setEmoji('💾')
            .setStyle(ButtonStyle.Primary)

        buttonRow.addComponents(loadButton);

        await interaction.reply({content: "", embeds: [embed], files: [attachment], components: [buttonRow] });
    },
};