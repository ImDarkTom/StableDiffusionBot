const { EmbedBuilder, AttachmentBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const base64ToBuffer = require("./base64ToBuffer");

module.exports = async (data, settings = { saveBtn: true }) => {
    const imageAttachment = new AttachmentBuilder(await base64ToBuffer(data.images[0]), { name: 'output.png'});
    const imageParams = JSON.parse(data.info); //imageData.parameters doesn't contain info such as seed or sampler_name.


    const embed = new EmbedBuilder()
            .setAuthor({name: `${imageParams.sampler_name} - ${imageParams.steps} - ${imageParams.cfg_scale}`})
            .setTitle(imageParams.prompt)
            .setImage('attachment://output.png')
            .setFooter({text: `Seed: ${imageParams.seed}`})
            .setColor("#00e100")

    const row = new ActionRowBuilder()
    
    if (settings.saveBtn) {
        const saveBtn = new ButtonBuilder()
            .setCustomId('saveImage')
            .setLabel('Save')
            .setEmoji('💾')
            .setStyle(ButtonStyle.Secondary)

        row.addComponents(saveBtn);
    }

    if (settings.saveBtn) {
        const redoBtn = new ButtonBuilder()
            .setCustomId('redoImage')
            .setLabel('Redo')
            .setEmoji('🔁')
            .setStyle(ButtonStyle.Primary)

        row.addComponents(redoBtn);
    }

    return {embeds: [embed], files: [imageAttachment], components: [row]};
};