const sendRequest = require("../../utils/SD/sendRequest");

module.exports = {
    id: 'cancelGeneration',
    ownerOnly: true,

    callback: async (client, interaction) => {
        await sendRequest('sdapi/v1/interrupt', {}, "post");

        interaction.reply({content: "Generating cancelled.", ephemeral: true});
    },
};