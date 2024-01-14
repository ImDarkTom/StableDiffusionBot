const axios = require("axios");
const { Embed } = require("discord.js");

/**
 * 
 * @param {Embed} embed 
 * @param {boolean} returnImageB64 
 * @returns {Promise<object>}
 */
module.exports = async(embed, returnImageB64 = false) => {
    const embedFields = embed.fields;

    const embedImage = embed.image;

    const data = {
        prompt: embed.title.match(/"([^"]*)"/)[1],
        negative_prompt: embedFields[4].value,
        seed: embedFields[0].value,
        width: embedImage.width,
        height: embedImage.height,
        steps: embedFields[1].value,
        cfg_scale: embedFields[2].value,
        sampler_name: embedFields[3].value,
        model: embed.footer.text
    };

    if (returnImageB64) {
        const response = await axios.get(embedImage.url, {responseType: 'arraybuffer'});
        const base64 = Buffer.from(response.data, 'binary').toString('base64');
        data.image = base64;
    }

    return data;
}