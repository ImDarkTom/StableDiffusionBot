const { devs, testServer } = require('../../../botConfig.json');
const getLocalButtons = require('../../utils/getLocalButtons');

module.exports = async (client, interaction) => {
    if (!interaction.isButton()) return;

    const localButtons = getLocalButtons();

    const buttonObject = localButtons.find(
        (btn) => btn.id === interaction.customId
    );

    if (!buttonObject) return;

    if (buttonObject.ownerOnly) {
        if (interaction.user.id != interaction.message.interaction.user.id) {
            interaction.reply({
                content: 'Only the caller of the command can use this!',
                ephemeral: true,
            });
            return;
        }
    }

    await buttonObject.callback(client, interaction);
};