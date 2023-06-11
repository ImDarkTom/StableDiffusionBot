const { ApplicationCommandOptionType } = require("discord.js");
const sendRequest = require("../../utils/SD/sendRequest");
const { EmbedBuilder } = require("@discordjs/builders");

module.exports = {
    name: 'sdinfo',
    description: 'Info on the Stable Diffusion instance.',
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
        const subcommand = interaction.options._subcommand;
        const embedColors = {
            loras: 0xFF00FF,
            hypernetworks: 0xFF4500
        };

        let embed;

        if (["loras", "hypernetworks"].includes(subcommand)) {
            const data = await sendRequest(`sdapi/v1/${subcommand}`, {}, "get");

            embed = new EmbedBuilder()
                .setColor(embedColors[subcommand])
                .setTitle(`List of ${subcommand}`)
                .setDescription(`Total ${subcommand}: ${data.length}.`)

            for (const item of data) {
                embed.addFields([{
                    name: item.name,
                    value: `\`<${subcommand == "lora" ? "lora" : "hypernet"}:${item.name}:1>\`${item?.alias && item.name != item.alias ? `\n\`<${subcommand == "lora" ? "lora" : "hypernet"}:${item.alias}:1>\``: ''}`,
                    inline: false
                }]);
            };
        }

        if (subcommand == "embeddings") {
            const data = await sendRequest(`sdapi/v1/embeddings`, {}, "get");
            const hypernets = Object.keys(data.loaded);

            embed = new EmbedBuilder()
                .setColor(0x00FFFF)
                .setTitle(`List of embeddings`)
                .setDescription(`Total embeddings: ${hypernets.length}.`)

            for (const item of hypernets) {
                embed.addFields([{
                    name: item,
                    value: `\`${item}\``,
                    inline: false
                }]);
            };
        }

        interaction.reply({content: "", embeds: [embed]});
    },
};