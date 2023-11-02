const { EmbedBuilder, Client, StringSelectMenuInteraction } = require("discord.js");
const sdConfig = require('../../../sdConfig.json');

module.exports = {
    id: 'upscalerDropdown',
    ownerOnly: true,

    /**
     * 
     * @param {Client} _client 
     * @param {StringSelectMenuInteraction} interaction 
     */
    callback: async (_client, interaction) => {
        const upscalerIndex = interaction.values[0];
        let upscalerName;

        for (const upscaler of sdConfig.upscalers) {
            if (String(upscaler.value) === upscalerIndex) {
                upscalerName = upscaler.name;
            }
        }

        const embed = new EmbedBuilder()
            .setTitle(`Selected '${upscalerName}' upscaler.`)
            .setColor(0x0080b0)

        await interaction.update({content: `${interaction.message.content.split("-")[0]}-${interaction.values[0]}`, components: [interaction.message.components[1]], embeds: [embed]});
    },
};