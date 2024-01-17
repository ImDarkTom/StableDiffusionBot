const getProgressEmbed = require("./getProgressEmbed");
const botConfig = require('../../../botConfig.json');
const sendRequest = require("./sendRequest");
const { ChatInputCommandInteraction, ButtonInteraction } = require("discord.js");

/**
 * 
 * @param {Promise} imagePromise Image to be generated promise.
 * @param {ChatInputCommandInteraction | ButtonInteraction} interaction "Waiting for SD..." message.
 * @param {String} generatingText Text to show while generating. Default "Generating..."
 * @returns 
 */
module.exports = async (imagePromise, interaction, generatingText = "Generating...") => {
    let interval;

    if (botConfig.generation.progressUpdateIntervalMs !== -1) {
        interval = setInterval( async () => {

            interaction.editReply(await getProgressEmbed(interaction.user, generatingText, true));
    
        }, botConfig.generation.progressUpdateIntervalMs);
    }

    const imageData = await imagePromise;

    if (interval) {
        clearInterval(interval);
    }

    const finishedData = await sendRequest('sdapi/v1/progress', {}, "get");

    return [finishedData, imageData];
}