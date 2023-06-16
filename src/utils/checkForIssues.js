const { baseUrl, port } = require('../../sdConfig.json');
const axios = require("axios");
const sendRequest = require('./SD/sendRequest');

module.exports = async () => {
    //SD
    await axios.get(`${baseUrl}:${port}/internal/ping`)
        .then(response => {
            console.log(`✅ ${response.status}: Stable Diffusion is running.`);
        })
        .catch(error => {
            console.error(`❌ ${error.code}: Stable Diffusion was not found. Please verify that you are using the correct url and port in the sdConfig.json file.`)
            process.exit([1])
        })

    //SD Api
    await axios.get(`${baseUrl}:${port}/docs`)
        .then(response => {
            console.log(`✅ ${response.status}: Stable Diffusion API is running.`);
        })
        .catch(error => {
            console.error(`❌ ${error.response.status}: Stable Diffusion API was not found. Make sure you are using the '--api' argument in the COMMANDLINE_ARGS of the webui-user file.`)
            process.exit([1])
        })

    //Check for Lyco extension, it breaks changing models
    try {
        await sendRequest('sdapi/v1/options', {}, "get");
    } catch (error) {
        if (error.response.data.error === "ValidationError") {
            console.warn("⚠ LyCORIS has been detected as an extension. This means that switching checkpoints will not work. Disabling the extension via the GUI will restore the ability to change checkpoints.")
        }
    }
};