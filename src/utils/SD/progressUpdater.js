const getProgressEmbed = require("./getProgressEmbed");
const botConfig = require('../../../botConfig.json');
const sendRequest = require("./sendRequest");
const { ChatInputCommandInteraction } = require("discord.js");

/**
 * 
 * @param {Promise} imagePromise Image to be generated promise.
 * @param {ChatInputCommandInteraction} interaction "Waiting for SD..." message.
 * @returns 
 */
module.exports = async (imagePromise, interaction) => {
    let interval;

    if (botConfig.progressUpdateIntervalMs !== -1) {
        interval = setInterval( async () => {

            interaction.editReply(await getProgressEmbed(interaction.user, "Generating... ", true));
    
        }, botConfig.progressUpdateIntervalMs);
    }

    const imageData = await imagePromise;

    if (interval) {
        clearInterval(interval);
    }

    const finishedData = await sendRequest('sdapi/v1/progress', {}, "get");

    return [finishedData, imageData];
}