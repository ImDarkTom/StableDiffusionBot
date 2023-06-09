const { ButtonStyle, ButtonBuilder, ActionRowBuilder } = require("discord.js");

module.exports = {
    id: 'upscaleImg',
    ownerOnly: false,

    callback: async (client, interaction) => {
        const interactionMsg = interaction.message;

        const upscale2x = new ButtonBuilder()
            .setCustomId('upscaleImg2x')
            .setLabel('2x')
            .setEmoji('⬆️')
            .setStyle(ButtonStyle.Secondary)

        const upscale4x = new ButtonBuilder()
            .setCustomId('upscaleImg4x')
            .setLabel('4x')
            .setEmoji('⬆️')
            .setStyle(ButtonStyle.Secondary)

        const row = new ActionRowBuilder()
            .addComponents(upscale2x, upscale4x)

        interaction.reply({content: interactionMsg.id, ephemeral: true, components: [row]});
    },
};