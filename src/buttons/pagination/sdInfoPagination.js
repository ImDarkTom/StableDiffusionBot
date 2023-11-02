//@ts-check
const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, StringSelectMenuOptionBuilder, StringSelectMenuBuilder, Client, ButtonInteraction } = require("discord.js");
const sendRequest = require("../../utils/SD/sendRequest");

module.exports = {
    id: 'sdInfoPagination',
    ownerOnly: false,

    /**
     * 
     * @param {Client} _client 
     * @param {ButtonInteraction} interaction 
     */
    callback: async (_client, interaction) => {
        const direction = interaction.customId.split('-')[1];

        const originalMessage = interaction.message;
        const originalEmbed = new EmbedBuilder(originalMessage.embeds[0].data);
        const originalComponents = originalMessage.components;

        const [prevButton, nextButton] = originalComponents[1].components.map((originalButton) => new ButtonBuilder(originalButton.data));

        //@ts-ignore
        const [modelType, page, totalPages, modelAmount] = originalEmbed.data.footer.text.split('.');


        let newPage;

        if (direction == "next") {
            newPage = Number(page) + 1;
        } else {
            newPage = Number(page) - 1;
        }

        if (newPage == 1) {
            prevButton.setDisabled(true);
        } else if (newPage == Number(totalPages)) {
            nextButton.setDisabled(true);
        } else {
            prevButton.setDisabled(false);
            nextButton.setDisabled(false);
        }

        originalEmbed
            .setTitle(`List of ${modelType} | Page ${newPage} of ${totalPages}`)
            .setFooter({text: `${modelType}.${newPage}.${totalPages}.${modelAmount}`})

        const newButtonRow = new ActionRowBuilder()
            .addComponents(prevButton, nextButton)


        const responseData = await sendRequest(`sdapi/v1/${modelType}`, {}, "get");

        const newSelectComponent = new StringSelectMenuBuilder()
            .setCustomId(`sdInfoDetailDropdown-${modelType}`)
            .setPlaceholder("Select an item to see details.")

        const startIndex = -25 + (newPage * 25);
        const endIndex = -1 + (newPage * 25);

        switch (modelType) {
            case "loras":
                const lorasList = responseData.slice(startIndex, endIndex);

                for (const item of lorasList) {
                    newSelectComponent.addOptions(
                        new StringSelectMenuOptionBuilder()
                            .setLabel(item.name)
                            .setDescription(`${item.name}, ${item.alias}`)
                            .setValue(`${item.name}||${item.alias}`)
                    )
                };
                break;
            
            case "hypernetworks":
                const hypernetsList = responseData.slice(startIndex, endIndex);

                for (const item of hypernetsList) {
                    const hypernetName = item.name;

                    newSelectComponent.addOptions(
                        new StringSelectMenuOptionBuilder()
                            .setLabel(hypernetName)
                            .setDescription(`<hypernet:${hypernetName}:1>`)
                            .setValue(hypernetName)
                    )
                };
                break;

            case "embeddings":
                const embeddingNames = Object.keys(responseData.loaded);

                const embeddingsList = embeddingNames.slice(startIndex, endIndex);

                for (const name of embeddingsList) {
                    newSelectComponent.addOptions(
                        new StringSelectMenuOptionBuilder()
                            .setLabel(name)
                            .setDescription(name)
                            .setValue(name)
                    )
                };
                break;
        }

        const newSelectComponentRow = new ActionRowBuilder()
            .addComponents(newSelectComponent)

        //@ts-ignore
        originalMessage.edit({content: "", embeds: [originalEmbed], components: [newSelectComponentRow, newButtonRow]});

        interaction.deferUpdate();
    },
};