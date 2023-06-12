const { ButtonStyle, ButtonBuilder, ActionRowBuilder } = require("discord.js");

module.exports = {
    id: 'upscaleImgMenu',
    ownerOnly: false,

    callback: async (client, interaction) => {
        const interactionMsg = interaction.message;

        const upscale2x = new ButtonBuilder()
            .setCustomId(`upscaleImg-${interaction.user.id}-2`)
            .setLabel('2x')
            .setEmoji('⬆️')
            .setStyle(ButtonStyle.Secondary)

        const upscale4x = new ButtonBuilder()
            .setCustomId(`upscaleImg-${interaction.user.id}-4`)
            .setLabel('4x')
            .setEmoji('⬆️')
            .setStyle(ButtonStyle.Secondary)

        const row = new ActionRowBuilder()
            .addComponents(upscale2x, upscale4x)

        interaction.reply({content: interactionMsg.id, ephemeral: false, components: [row]});
    },
};