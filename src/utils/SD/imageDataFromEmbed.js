const axios = require("axios");

module.exports = async(embed, returnImageB64 = false) => {
    const authorInfo = embed.author.name.split(' - ');

    if (returnImageB64) {
        const response = await axios.get(embed.image.url, {responseType: 'arraybuffer'});
        const base64 = Buffer.from(response.data, 'binary').toString('base64');

        return {
            image: base64,
            width: embed.image.width,
            height: embed.image.height,
            prompt: embed.title,
            cfg_scale: authorInfo[2],
            steps: authorInfo[1],
            sampler_name: authorInfo[0],
            seed: embed.footer.text.replace('Seed: ', '')
        }
    }

    return {
        prompt: embed.title,
        cfg_scale: authorInfo[2],
        steps: authorInfo[1],
        sampler_name: authorInfo[0],
        seed: embed.footer.text.replace('Seed: ', '')
    }
}