const axios = require("axios");

module.exports = async(embed, returnImageB64 = false) => {
    const embedFields = embed.fields;

    const data = {
        prompt: embed.title.match(/"([^"]*)"/)[1],
        cfg_scale: embedFields[2].value,
        steps: embedFields[1].value,
        seed: embedFields[0].value,
        model: embed.footer.text
    };

    if (returnImageB64) {
        const embedImage = embed.image;
        const response = await axios.get(embedImage.url, {responseType: 'arraybuffer'});
        const base64 = Buffer.from(response.data, 'binary').toString('base64');

        data.image = base64;
        data.width = embedImage.width;
        data.height = embedImage.height;
    }

    return data;
}