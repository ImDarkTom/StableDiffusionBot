const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    id: 'saveImage',
    ownerOnly: false,

    callback: async (client, interaction) => {
        const interactionMsg = interaction.message;

        const downloadBtn = new ButtonBuilder()
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

        interaction.reply({content: interactionMsg.id, ephemeral: true, components: [row]});
    },
};