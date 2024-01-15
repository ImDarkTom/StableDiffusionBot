const { AttachmentBuilder, Attachment } = require('discord.js');
const sharp = require('sharp');

/**
 * Turns a Base64 encoded image into an attachment.
 * @param {String} encodedString Base64 encoded image string.
 * @param {keyof sharp.FormatEnum} resultFormat The image format to return the buffer as, default png.
 * @param {String} filename The filename of the atachment, default is 'image'.
 * @returns {Promise<Attachment>}
 */
module.exports = async (encodedString, resultFormat = "png", filename = "image") => {
    const buffer = Buffer.from(encodedString, 'base64');

    const bufferAsImage = await sharp(buffer).toFormat(resultFormat).toBuffer();

    const attachment = new AttachmentBuilder(bufferAsImage, {name: `${filename}.${resultFormat}`, description: ""});

    return attachment;
};