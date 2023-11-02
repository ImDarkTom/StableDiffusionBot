const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, Client, ChatInputCommandInteraction } = require("discord.js");
const sdConfig = require('../../../sdConfig.json')
const sendRequest = require("../../utils/SD/sendRequest");

module.exports = {
    name: 'changemodel',
    description: 'Change the stable diffusion model.',
    // devOnly: Boolean,
    // testOnly: Boolean,
    // deleted: Boolean,

    /**
     * 
     * @param {Client} _client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    callback: async (_client, interaction) => {
        let modelList = [];
        let embed;
        const modelsResponse = await sendRequest('sdapi/v1/sd-models', {}, "get");

        for (const model of modelsResponse) {
            modelList.push({
                label: model.title,
                description: model.hash ? model.hash : "Unknown hash",
                value: model.model_name
            });
        }

        embed = new EmbedBuilder()
            .setTitle("Please select a model from the dropdown...")
            .setColor(0x7ba4d1)

        const dropdown = new StringSelectMenuBuilder()
            .setCustomId(`modelDropdown-${interaction.user.id}`)
            .setPlaceholder(`Default: ${sdConfig.generationDefaults.defaultModel}`)
            .addOptions(modelList)

        const row = new ActionRowBuilder()
            .addComponents(dropdown)

        await interaction.reply({content: "", embeds: [embed], components: [row]})
    },
};