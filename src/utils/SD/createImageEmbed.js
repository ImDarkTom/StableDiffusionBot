const { EmbedBuilder, AttachmentBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const base64ToBuffer = require("./base64ToBuffer");
const botConfig = require('../../../botConfig.json')

module.exports = async (data, settings = { saveBtn: true, upscaleBtn: true, redoBtn: false }, user, context = "") => {

    const imageAttachment = new AttachmentBuilder(await base64ToBuffer(data.images[0]), { name: 'output.png'});
    const imageParams = JSON.parse(data.info); //imageData.parameters doesn't contain info such as seed or sampler_name.
    let embed;

    if (botConfig.showImageAuthor) {
        embed = new EmbedBuilder()
            .setAuthor({name: `${user.username}#${user.discriminator}`, iconURL: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}?size=256`})
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
                    name: "CFG SCale",
                    value: imageParams.cfg_scale.toString(),
                    inline: true
                }
            ])
            .setTitle(`${context != "" ? `${context} - ` : ""}"${imageParams.prompt}"`)
            .setImage('attachment://output.png')
            .setFooter({text: imageParams.infotexts[0].match(/Model: ([^,]+)/)[1]})
            .setColor("#00bb00")
    } else {
        embed = new EmbedBuilder()
            .setTitle(imageParams.prompt)
            .setImage('attachment://output.png')
            .setFooter({text: `Seed: ${imageParams.seed}`})
            .setColor("#00e100")
    }
    

    const row = new ActionRowBuilder()
    
    if (settings.saveBtn) {
        const saveBtn = new ButtonBuilder()
            .setCustomId('saveImage')
            .setLabel('Save')
            .setEmoji('💾')
            .setStyle(ButtonStyle.Secondary)

        row.addComponents(saveBtn);
    }

    if (settings.upscaleBtn) {
        const upscaleBtn = new ButtonBuilder()
            .setCustomId('upscaleImg')
            .setLabel('Upscale')
            .setEmoji('🖼️')
            .setStyle(ButtonStyle.Secondary)

        row.addComponents(upscaleBtn);
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