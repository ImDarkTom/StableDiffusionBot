const { EmbedBuilder, AttachmentBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, User } = require("discord.js");
const base64ToBuffer = require("./base64ToBuffer");
const botConfig = require('../../../botConfig.json')


/**
 * 
 * @param {Object[]} data 
 * @param {Object} settings 
 * @param {boolean} settings.upscaleBtn Should the image be able to be upscaled?
 * @param {boolean} settings.redoBtn Should the image be able to be redone?
 * @param {string} settings.additionalTitleText Text to add alongside the prompt in the title.
 * @param {User} user The user that requested the image.
 * @returns {Promise<import("discord.js").MessagePayloadOption>}
 */
module.exports = async (data, settings = {upscaleBtn: true, redoBtn: false, additionalTitleText: ""}, user) => {
    const additionalTitleText = settings.additionalTitleText;
    const formattedAdditionalTitleText = additionalTitleText == undefined ? "" : `${additionalTitleText} - `;
    
    const [progressData, imageData] = data;
    const cancelled = progressData.state.interrupted;

    const imageAttachment = new AttachmentBuilder(await base64ToBuffer(imageData.images[0]), {name: 'output.png', description: ""});
    const imageParams = JSON.parse(imageData.info); //imageData.parameters doesn't contain info such as seed or sampler_name.

    let embed = new EmbedBuilder()
        .addFields([
            {
                name: "Seed",
                value: imageParams.seed.toString(),
                inline: true
            },
            {
                name: "Steps",
                value: imageParams.steps.toString(),
                inline: true
            },
            {
                name: "CFG Scale",
                value: imageParams.cfg_scale.toString(),
                inline: true
            },
            {
                name: "Sampler Name",
                value: imageParams.sampler_name.toString(),
                inline: true
            },
            {
                name: "Negative Prompt",
                value: imageParams.negative_prompt.toString(),
                inline: true
            }
        ])
        .setTitle(`${cancelled ? "Cancelled - ": ""}${formattedAdditionalTitleText}"${imageParams.prompt}"`)
        .setImage('attachment://output.png')
        .setFooter({ text: imageParams.infotexts[0].match(/Model: ([^,]+)/)[1] })
        .setColor(cancelled ? "#bb0000" : "#00bb00")

    if (botConfig.generation.showImageAuthor) { 
        embed.setAuthor({name: user.username, iconURL: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}?size=256`}); 
    }
    
    const row = new ActionRowBuilder()

    if (settings.redoBtn) {
        const redoBtn = new ButtonBuilder()
            .setCustomId('redoImage')
            .setLabel('Redo')
            .setEmoji('🔁')
            .setStyle(ButtonStyle.Primary)
        row.addComponents(redoBtn);
    }
    
    const saveBtn = new ButtonBuilder()
        .setCustomId('saveImage')
        .setLabel('Save')
        .setEmoji('💾')
        .setStyle(ButtonStyle.Secondary)

    row.addComponents(saveBtn);

    if (settings.upscaleBtn && !cancelled) {
        const upscaleBtn = new ButtonBuilder()
            .setCustomId('upscaleImageMenu')
            .setLabel('Upscale')
            .setEmoji('🖼️')
            .setStyle(ButtonStyle.Secondary)

        row.addComponents(upscaleBtn);
    }

    return {embeds: [embed], files: [imageAttachment], components: [row]};
};