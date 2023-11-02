//@ts-check
const sharp = require('sharp');

/**
 * 
 * @param {String} encoded Base64 encoded image string.
 * @returns {Promise<Buffer>}
 */
module.exports = async (encoded) => {
    const buffer = Buffer.from(encoded, 'base64');

    const imagePromise = sharp(buffer).png().toBuffer();

    return imagePromise;
};