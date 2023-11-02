const { EmbedBuilder, Client, StringSelectMenuInteraction } = require('discord.js');

module.exports = {
    id: 'sdInfoDetailDropdown',
    ownerOnly: false,

    /**
     * 
     * @param {Client} _client 
     * @param {StringSelectMenuInteraction} interaction 
     */
    callback: async (_client, interaction) => {
        const modelType = interaction.customId.split('-')[1];
        const name = interaction.values[0];

        const modelTypeSingular = modelType.match(/^(.*?)(s)?$/)[1];

        const embed = new EmbedBuilder()
            .setFooter({text: modelTypeSingular})

        switch (modelTypeSingular) {
            case 'lora':
                const [loraName, loraAlias] = name.split('||');
            
                const usageString = loraName == loraAlias ? `\`<lora:${loraName}:1>\`` : `\`<lora:${loraName}:1>\` or \`<lora:${loraAlias}:1>\``;

                embed
                    .setTitle(loraName)
                    .setColor("DarkAqua")
                    .setDescription(`Usage in prompt: ${usageString}`)

                break
            
            case 'embedding':
                embed
                    .setTitle(name)
                    .setColor("DarkGreen")
                    .setDescription(`Usage in prompt: \`${name}\``)

                break
                
            case 'hypernetwork':
                embed
                    .setTitle(name)
                    .setColor("DarkOrange")
                    .setDescription(`Usage in prompt: \`<hypernet:${name}:1>\``)
        }

        await interaction.reply({content: "", embeds: [embed], ephemeral: true});
    },
};