//@ts-check
const { ButtonInteraction, Client, EmbedBuilder } = require("discord.js");
const sendRequest = require("../../utils/SD/sendRequest");

module.exports = {
    id: 'loadCheckpoint',
    ownerOnly: false,

    /**
     * 
     * @param {Client} _client 
     * @param {ButtonInteraction} interaction 
     */
    callback: async (_client, interaction) => {
        const modelName = interaction.message.embeds[0].title;

        await interaction.message.delete();

        const loadingEmbed = new EmbedBuilder()
            .setColor(0xfde395)
            .setTitle('Loading checkpoint...')
            .setDescription(`Loading "**${modelName}**".`)

        await interaction.reply({content: "", embeds: [loadingEmbed]});

        let options = await sendRequest('sdapi/v1/options', {}, "get");

        options["sd_model_checkpoint"] = modelName;

        await sendRequest('sdapi/v1/options', options, "post");

        const finishedEmbed = new EmbedBuilder()
            .setColor(0x82d17b)
            .setTitle('Checkpoint loaded!')
            .setDescription(`Checkpoint "**${modelName}**" has successfully loaded.`)

        await interaction.editReply({content: "", embeds: [finishedEmbed]});
    },
};