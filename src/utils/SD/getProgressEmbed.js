const { EmbedBuilder, AttachmentBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, User } = require("discord.js");
const sendRequest = require("./sendRequest");
const botConfig = require('../../../botConfig.json');
const base64ToBuffer = require("./base64ToBuffer");

/**
 * 
 * @param {User} user 
 * @param {string} context Text to add alongside the progress embed.
 * @param {boolean} addCancelButton 
 * @returns {Promise<import("discord.js").MessagePayloadOption>}
 */
module.exports = async (user, context = "", addCancelButton = true) => {
    let data;

    while (true) {
        data = await sendRequest('sdapi/v1/progress?skip_current_image=false', {}, "get");

        if ("progress" in data) {
            break;
        } else {
            await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second timeout
        }
    }

    if (data.current_image == null) { // Make better later
        const embed = new EmbedBuilder()
            .setColor('Yellow')
            .setTitle('Starting...')

        if (botConfig.showImageAuthor) { embed.setAuthor({name: user.username, iconURL: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}?size=256`}); }

        return {content: "", embeds: [embed]};
    }

    //Embed
    const progress = Math.round(data.progress*100);
    const progressBarCompletion = Math.ceil(progress/10);

    const imageBuffer = await base64ToBuffer(data.current_image);

    const image = new AttachmentBuilder(imageBuffer, {name: 'progress.png'});

    const embed = new EmbedBuilder()
        .setTitle(`${context}${progress}%\n|${"▓".repeat(progressBarCompletion)}${"░".repeat(10 - progressBarCompletion)}|`)
        .setFooter({text: `ETA: ${data.eta_relative.toFixed(1)}s`})
        .setImage('attachment://progress.png')
        .setColor("Yellow")

    if (botConfig.showImageAuthor) { embed.setAuthor({name: user.username, iconURL: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}?size=256`}); }

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