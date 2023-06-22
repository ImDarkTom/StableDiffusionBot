module.exports = {
    id: 'cancelUpscale',
    ownerOnly: true,

    callback: async (client, interaction) => {
        await interaction.message.delete();
    },
};