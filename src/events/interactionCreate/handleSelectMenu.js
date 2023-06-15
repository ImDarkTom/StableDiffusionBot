const getLocalSelectMenus = require('../../utils/getLocalSelectMenus');

module.exports = async (client, interaction) => {
    if (!interaction.isStringSelectMenu()) return;

    const localMenus = getLocalSelectMenus();
    const customId = interaction.customId.split('-');

    const menuObject = localMenus.find(
        (menu) => menu.id === customId[0]
    );

    if (!menuObject) return;

    if (menuObject.ownerOnly) {
        if (customId[1] != interaction.user.id) {
            interaction.reply({
                content: 'Only the caller of the command can use this!',
                ephemeral: true,
            });
            return;
        }
    }

    await menuObject.callback(client, interaction);
};