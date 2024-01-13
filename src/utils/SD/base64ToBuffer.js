//@ts-check
const sharp = require('sharp');

/**
 * Turns a Base64 encoded image into a buffer.
 * @param {String} encodedString Base64 encoded image string.
 * @param {keyof sharp.FormatEnum} resultFormat The image format to return the buffer as, default png.
 * @returns {Promise<Buffer>}
 */
module.exports = async (encodedString, resultFormat = "png") => {
    const buffer = Buffer.from(encodedString, 'base64');

    const imagePromise = sharp(buffer).toFormat(resultFormat).toBuffer();

    return imagePromise;
};