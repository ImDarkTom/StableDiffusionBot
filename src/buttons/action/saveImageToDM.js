module.exports = {
    id: 'saveImageToDM',
    ownerOnly: false,

    callback: async (client, interaction) => {
        const msgToSaveEmbed = await interaction.channel.messages.fetch(interaction.message.content);

        interaction.member.user.send({content: "", embeds: [msgToSaveEmbed.embeds[0]]});
    },
};