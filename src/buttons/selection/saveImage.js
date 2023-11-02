//@ts-check
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, Client, ButtonInteraction } = require('discord.js');

module.exports = {
    id: 'saveImage',
    ownerOnly: false,

    /**
     * 
     * @param {Client} _client 
     * @param {ButtonInteraction} interaction 
     */
    callback: (_client, interaction) => {
        const interactionMsg = interaction.message;

        const downloadBtn = new ButtonBuilder()
            //@ts-ignore
            .setURL(interaction.message.embeds[0].image.url)
            .setLabel('Download')
            .setStyle(ButtonStyle.Link)

        const saveToDM = new ButtonBuilder()
            .setCustomId('saveImageToDM')
            .setLabel('Save to DM')
            .setEmoji('📥')
            .setStyle(ButtonStyle.Primary)

        const row = new ActionRowBuilder()
            .addComponents(downloadBtn, saveToDM)

        //@ts-ignore
        interaction.reply({content: interactionMsg.id, ephemeral: true, components: [row]});
    },
};