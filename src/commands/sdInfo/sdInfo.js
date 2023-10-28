const { ApplicationCommandOptionType, EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder } = require("discord.js");
const sendRequest = require("../../utils/SD/sendRequest");

module.exports = {
    name: 'sdinfo',
    description: 'Get info on the Stable Diffusion instance.',
    // devOnly: Boolean,
    // testOnly: Boolean,
    options: [
        {
            name: "loras",
            description: "Gets a list of available LoRAs.",
            type: ApplicationCommandOptionType.Subcommand,
        },
        {
            name: "embeddings",
            description: "Gets a list of available embeddings.",
            type: ApplicationCommandOptionType.Subcommand
        },
        {
            name: "hypernetworks",
            description: "Gets a list of available hypernetworks.",
            type: ApplicationCommandOptionType.Subcommand
        }
    ],
    // deleted: Boolean,

    callback: async (client, interaction) => {
        const subcommandName = interaction.options._subcommand;

        const select = new StringSelectMenuBuilder()
            .setCustomId(`sdInfoDetailDropdown-${subcommandName}`)
            .setPlaceholder("Select an item to see details.")

        const responseData = await sendRequest(`sdapi/v1/${subcommandName}`, {}, "get");

        switch (subcommandName) {
            case "loras":
                for (const item of responseData) {
                    select.addOptions(
                        new StringSelectMenuOptionBuilder()
                            .setLabel(item.name)
                            .setDescription(`${item.name}, ${item.alias}`)
                            .setValue(`${item.name}||${item.alias}`)
                    )
                };
                break;

            case "hypernetworks":
                for (const item of responseData) {
                    const hypernetName = item.name;

                    select.addOptions(
                        new StringSelectMenuOptionBuilder()
                            .setLabel(hypernetName)
                            .setDescription(`<hypernet:${hypernetName}:1>`)
                            .setValue(hypernetName)
                    )
                };
                break;
            
            case "embeddings":
                const embeddingNames = Object.keys(responseData.loaded);

                for (const name of embeddingNames) {
                    select.addOptions(
                        new StringSelectMenuOptionBuilder()
                            .setLabel(name)
                            .setDescription(name)
                            .setValue(name)
                    )
                };
                
        }

        const row = new ActionRowBuilder()
                .addComponents(select);

        const embed = new EmbedBuilder()
                .setColor("Orange")
                .setTitle(`List of ${subcommandName}`)
                .setDescription(`Total ${subcommandName}: ${select.options.length}`)

        interaction.reply({content: "", embeds: [embed], components: [row], ephemeral: true});
    },
};