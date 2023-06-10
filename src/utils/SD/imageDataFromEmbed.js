const axios = require("axios");

module.exports = async(embed, returnImageB64 = false) => {
    const embedFields = embed.fields;

    if (returnImageB64) {
        const response = await axios.get(embed.image.url, {responseType: 'arraybuffer'});
        const base64 = Buffer.from(response.data, 'binary').toString('base64');

        return {
            image: base64,
            width: embed.image.width,
            height: embed.image.height,
            prompt: embed.title.match(/"([^"]*)"/)[1],
            cfg_scale: embedFields[2].value,
            steps: embedFields[1].value,
            seed: embedFields[0].value,
            model: embed.footer.text
        }
    }

    return {
        prompt: embed.title.match(/"([^"]*)"/)[1],
        cfg_scale: embedFields[2].value,
        steps: embedFields[1].value,
        seed: embedFields[0].value,
        model: embed.footer.text
    }
}