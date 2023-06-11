const { EmbedBuilder, AttachmentBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const sendRequest = require("./sendRequest");
const botConfig = require('../../../botConfig.json');
const base64ToBuffer = require("./base64ToBuffer");

module.exports =  async (user, context = "", addCancelButton = true) => {
    const data = await sendRequest('sdapi/v1/progress?skip_current_image=false', {}, "get");

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

    if (botConfig.showImageAuthor) { embed.setAuthor({name: `${user.username}#${user.discriminator}`, iconURL: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}?size=256`}); }

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