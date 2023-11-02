//@ts-check
const { ButtonStyle, ButtonBuilder, ActionRowBuilder, StringSelectMenuBuilder, ButtonInteraction, Client } = require("discord.js");
const sdConfig = require("../../../sdConfig.json");

module.exports = {
    id: 'upscaleImageMenu',
    ownerOnly: false,

    /**
     * 
     * @param {Client} _client 
     * @param {ButtonInteraction} interaction 
     */
    callback: async (_client, interaction) => {
        const interactionMsg = interaction.message;

        const upscale2x = new ButtonBuilder()
            .setCustomId(`upscaleImage-${interaction.user.id}-2`)
            .setLabel('2x')
            .setEmoji('⬆️')
            .setStyle(ButtonStyle.Secondary)

        const upscale4x = new ButtonBuilder()
            .setCustomId(`upscaleImage-${interaction.user.id}-4`)
            .setLabel('4x')
            .setEmoji('⬆️')
            .setStyle(ButtonStyle.Secondary)

        const cancel = new ButtonBuilder()
            .setCustomId(`cancelUpscale-${interaction.user.id}`)
            .setLabel('Cancel')
            .setEmoji('✖')
            .setStyle(ButtonStyle.Danger)

        const dropdown = new StringSelectMenuBuilder()
            .setCustomId(`upscalerDropdown-${interaction.user.id}`)

        for (const upscaler of sdConfig.upscalers) {
            dropdown.addOptions([
                {
                    label: upscaler.name,
                    description: String(upscaler.value),
                    value: String(upscaler.value),
                    default: upscaler.default || false
                }
            ])
        }

        const row = new ActionRowBuilder()
            .addComponents(upscale2x, upscale4x, cancel)

        const selectionRow = new ActionRowBuilder()
            .addComponents(dropdown)

        //@ts-ignore
        interaction.reply({content: `${interactionMsg.id}-${sdConfig.generationDefaults.defaultUpscalerIndex}`, ephemeral: false, components: [selectionRow, row]});
    },
};