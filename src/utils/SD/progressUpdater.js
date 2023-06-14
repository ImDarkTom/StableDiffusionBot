const getProgressEmbed = require("./getProgressEmbed");
const botConfig = require('../../../botConfig.json');
const sendRequest = require("./sendRequest");

module.exports = async (imagePromise, interaction) => {
    const interval = setInterval( async () => {

        interaction.editReply(await getProgressEmbed(interaction.user, "Generating... ", true));

    }, botConfig.progressUpdateInterval);
    
    const imageData = await imagePromise;

    clearInterval(interval);

    const finishedData = await sendRequest('sdapi/v1/progress', {}, "get");

    return [finishedData, imageData];
}