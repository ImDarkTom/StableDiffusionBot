//@ts-check
const { EmbedBuilder, Client, StringSelectMenuInteraction } = require('discord.js');
const sendRequest = require('../../utils/SD/sendRequest');

module.exports = {
    id: 'modelDropdown',
    ownerOnly: true,

    /**
     * 
     * @param {Client} _client 
     * @param {StringSelectMenuInteraction} interaction 
     */
    callback: async (_client, interaction) => {
        const modelValue = interaction.values[0];
        let embed;

        embed = new EmbedBuilder()
            .setColor(0x7ba4d1)
            .setTitle('Loading checkpoint...')
            .setDescription(`Loading "**${modelValue}**". Please wait for the checkpoint to load.`)

        await interaction.reply({content: "", embeds: [embed]});

        interaction.message.delete();

        let options = await sendRequest('sdapi/v1/options', {}, "get");

        options["sd_model_checkpoint"] = modelValue;

        await sendRequest('sdapi/v1/options', options, "post");

        embed = new EmbedBuilder()
            .setColor(0x82d17b)
            .setTitle('Checkpoint loaded!')
            .setDescription(`Checkpoint "**${modelValue}**" has successfully loaded.`)

        await interaction.editReply({content: "", embeds: [embed]});
    },
};