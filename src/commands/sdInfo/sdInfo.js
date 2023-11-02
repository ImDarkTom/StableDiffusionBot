const { ApplicationCommandOptionType, EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Client, ChatInputCommandInteraction } = require("discord.js");
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

    /**
     * 
     * @param {Client} _client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    callback: async (_client, interaction) => {
        const subcommandName = interaction.options.getSubcommand();

        const select = new StringSelectMenuBuilder()
            .setCustomId(`sdInfoDetailDropdown-${subcommandName}`)
            .setPlaceholder("Select an item to see details.")

        const embed = new EmbedBuilder()
            .setColor("Orange")
            .setTitle(`List of ${subcommandName}`)

        
        const responseData = await sendRequest(`sdapi/v1/${subcommandName}`, {}, "get");
        let addPaginationButtons = false;

        let totalPages;
        let pageData;
        let modelsCount;

        switch (subcommandName) {
            case "loras":
                const loraCount = responseData.length;
                modelsCount = loraCount;

                if (loraCount < 25) {
                    for (const item of responseData) {
                        select.addOptions(
                            new StringSelectMenuOptionBuilder()
                                .setLabel(item.name)
                                .setDescription(`${item.name}, ${item.alias}`)
                                .setValue(`${item.name}||${item.alias}`)
                        )
                    };
                    break;
                }
                
                totalPages = Math.ceil(loraCount/25);

                embed
                    .setFooter({ text: `loras.1.${totalPages}.${loraCount}` })
                    .setTitle(`List of ${subcommandName} | Page 1 of ${totalPages}`)
                
                pageData = responseData.slice(0, 24);

                for (const item of pageData) {
                    select.addOptions(
                        new StringSelectMenuOptionBuilder()
                            .setLabel(item.name)
                            .setDescription(`${item.name}, ${item.alias}`)
                            .setValue(`${item.name}||${item.alias}`)
                    )
                };

                addPaginationButtons = true;
                break;

            case "hypernetworks":
                const hypernetsCount = responseData.length;
                modelsCount = hypernetsCount;

                if (hypernetsCount < 25) {
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

                }

                totalPages = Math.ceil(hypernetsCount/25);

                embed
                    .setFooter({ text: `hypernetworks.1.${totalPages}.${hypernetsCount}` })
                    .setTitle(`List of ${subcommandName} | Page 1 of ${totalPages}`)
                
                pageData = responseData.slice(0, 24);

                for (const item of pageData) {
                    const hypernetName = item.name;

                    select.addOptions(
                        new StringSelectMenuOptionBuilder()
                            .setLabel(hypernetName)
                            .setDescription(`<hypernet:${hypernetName}:1>`)
                            .setValue(hypernetName)
                    )
                };

                addPaginationButtons = true;
                break;

            
            case "embeddings":
                const embeddingNames = Object.keys(responseData.loaded);

                const embeddingsCount = embeddingNames.length;
                modelsCount = embeddingsCount;

                if (embeddingsCount < 25) {
                    for (const name of embeddingNames) {
                        select.addOptions(
                            new StringSelectMenuOptionBuilder()
                                .setLabel(name)
                                .setDescription(name)
                                .setValue(name)
                        )
                    };
                    break;
                    
                }
                
                totalPages = Math.ceil(embeddingsCount/25);

                embed
                    .setFooter({ text: `hypernetworks.1.${totalPages}.${embeddingsCount}` })
                    .setTitle(`List of ${subcommandName} | Page 1 of ${totalPages}`)
                
                pageData = embeddingNames.slice(0, 24);

                for (const name of embeddingNames) {
                    select.addOptions(
                        new StringSelectMenuOptionBuilder()
                            .setLabel(name)
                            .setDescription(name)
                            .setValue(name)
                    )
                };

                addPaginationButtons = true;
                break;
        }

        const selectionRow = new ActionRowBuilder()
                .addComponents(select);

        const componentsList = [];
        componentsList.push(selectionRow)

        if (addPaginationButtons) {
            const prevButton = new ButtonBuilder()
                .setCustomId('sdInfoPagination-prev')
                .setLabel('Prev. Page')
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(true)
            
            const nextButton = new ButtonBuilder()
                .setCustomId('sdInfoPagination-next')
                .setLabel('Next Page')
                .setStyle(ButtonStyle.Secondary)

            const buttonRow = new ActionRowBuilder()
                .addComponents(prevButton, nextButton);

            componentsList.push(buttonRow);
        }

        embed.setDescription(`Total ${subcommandName}: ${modelsCount}`);

        interaction.reply({content: "", embeds: [embed], components: componentsList, ephemeral: false});
    },
};