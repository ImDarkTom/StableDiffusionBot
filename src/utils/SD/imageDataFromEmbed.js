module.exports = (embed) => {
    const authorInfo = embed.author.name.split(' - ');

    return {
        prompt: embed.title,
        cfg_scale: authorInfo[2],
        steps: authorInfo[1],
        sampler_name: authorInfo[0],
        seed: embed.footer.text.replace('Seed: ', '')
    }
}