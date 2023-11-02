//@ts-check
const { Client, ButtonInteraction, User } = require("discord.js");

module.exports = {
    id: 'saveImageToDM',
    ownerOnly: false,

    /**
     * 
     * @param {Client} _client 
     * @param {ButtonInteraction} interaction 
     */
    callback: async (_client, interaction) => {
        if (interaction.channel && interaction.member) {
            const msgToSaveEmbed = await interaction.channel.messages.fetch(interaction.message.content);

            if (interaction.member.user instanceof User) {
                interaction.member.user.send({content: "", embeds: [msgToSaveEmbed.embeds[0]]});
            }
        }
    },
};