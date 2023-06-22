const { EmbedBuilder } = require("discord.js");

module.exports = {
    id: 'upscalerDropdown',
    ownerOnly: true,

    callback: async (client, interaction) => {
        const embed = new EmbedBuilder()
            .setTitle(`Selected '${interaction.values[0]}'`)

        await interaction.update({content: `${interaction.message.content.split("-")[0]}-${interaction.values[0]}`, components: [interaction.message.components[1]], embeds: [embed]});
    },
};