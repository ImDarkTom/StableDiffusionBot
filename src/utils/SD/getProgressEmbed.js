const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, User } = require("discord.js");
const sendRequest = require("./sendRequest");
const botConfig = require('../../../botConfig.json');
const base64ToAttachment = require("./base64ToAttachment");

/**
 * 
 * @param {User} user 
 * @param {string} generatingText Text to add alongside the progress embed.
 * @param {boolean} addCancelButton 
 * @returns {Promise<import("discord.js").MessagePayloadOption>}
 */
module.exports = async (user, generatingText, addCancelButton = true) => {
    const imageProgressData = await sendRequest('sdapi/v1/progress?skip_current_image=false', {}, "get");

    if (imageProgressData.current_image == null) { // Make better later
        const embed = new EmbedBuilder()
            .setColor('Yellow')
            .setTitle('Starting...')

        if (botConfig.generation.showImageAuthor) { 
            embed.setAuthor({name: user.username, iconURL: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}?size=256`}); 
        }

        return {content: "", embeds: [embed]};
    }

    //Embed
    const progress = Math.round(imageProgressData.progress*100);
    const progressBarCompletion = Math.ceil(progress/10);

    const imagePreviewFormat = botConfig.generation.imagePreviewFormat;

    const image = await base64ToAttachment(imageProgressData.current_image, imagePreviewFormat, "progress");

    const embed = new EmbedBuilder()
        .setTitle(`${generatingText}${progress}%\n|${"▓".repeat(progressBarCompletion)}${"░".repeat(10 - progressBarCompletion)}|`)
        .setFooter({text: `ETA: ${imageProgressData.eta_relative.toFixed(1)}s`})
        .setImage(`attachment://progress.${imagePreviewFormat}`)
        .setColor("Yellow")

    if (botConfig.generation.showImageAuthor) { 
        embed.setAuthor({name: user.username, iconURL: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}?size=256`}); 
    }

    //Buttons
    const row = new ActionRowBuilder();

    if (addCancelButton) {
        const cancelBtn = new ButtonBuilder()
            .setCustomId(`cancelGeneration-${user.id}`)
            .setLabel('Cancel')
            .setEmoji('🚫')
            .setStyle(ButtonStyle.Danger)

        row.addComponents(cancelBtn);
    }

    return {content: "", embeds: [embed], files: [image], components: [row]};
};