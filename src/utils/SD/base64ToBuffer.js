const sharp = require('sharp');

module.exports = async (encoded) => {
    const buffer = Buffer.from(encoded, 'base64');

    const image = await sharp(buffer).png().toBuffer();

    return image;
};