//@ts-check
const { ChatInputCommandInteraction, ButtonInteraction } = require('discord.js')
const createImageEmbed = require("./createImageEmbed");
const progressUpdater = require("./progressUpdater");
const sendRequest = require("./sendRequest");

/**
 * 
 * @param {string} route The SD api route e.g "sdapi/v1/txt2img".
 * @param {object} requestData JSON data to be sent with axios request to api.
 * @param {ChatInputCommandInteraction | ButtonInteraction} interaction Command interaction to reply to.
 * @param {object} embedData createImageEmbed parameters.
 */
module.exports = async (route, requestData, interaction, embedData) => {
    await interaction.reply({ content: "Waiting for Stable Diffusion..." });

    const imagePromise = sendRequest(route, requestData);

    const progressFinish = await progressUpdater(imagePromise, interaction, embedData.generatingText);

    await interaction.editReply(await createImageEmbed(progressFinish, embedData, interaction.user));
}