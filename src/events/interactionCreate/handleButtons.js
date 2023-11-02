//@ts-check
const { Client } = require('discord.js');
const getLocalButtons = require('../../utils/getLocalButtons');

/**
 * 
 * @param {Client} client 
 * @param {import('discord.js').Interaction} interaction 
 * @returns 
 */
module.exports = async (client, interaction) => {
    if (!interaction.isButton()) return;

    const localButtons = getLocalButtons();
    const customId = interaction.customId.split('-');

    const buttonObject = localButtons.find(
        (btn) => btn.id === customId[0]
    );

    if (!buttonObject) return;

    if (buttonObject.ownerOnly) {
        if (customId[1] != interaction.user.id) {
            interaction.reply({
                content: 'Only the caller of the command can use this!',
                ephemeral: true,
            });
            return;
        }
    }

    await buttonObject.callback(client, interaction);
};