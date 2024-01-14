require('dotenv').config();
const { Client, IntentsBitField } = require('discord.js');
const eventHandler = require('./handlers/eventHandler');
const axios = require("axios");
const https = require('https');
const fs = require('fs');
const sendRequest = require('./utils/SD/sendRequest');
const { baseUrl, port, useUltimateSdUpscale, extensionConfigs } = require('../sdConfig.json');

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
});

(async () => {
    //SD
    await axios.get(`${baseUrl}:${port}/internal/ping`)
        .then(response => {
            console.log(`✅ ${response.status}: Stable Diffusion is running.`);
        })
        .catch(error => {
            if (error.code == "DEPTH_ZERO_SELF_SIGNED_CERT") {
                const autoTlsHttpsConfig = extensionConfigs.autoTlsHttps;

                try {
                    const certFile = fs.readFileSync(autoTlsHttpsConfig.certFilePath);
                    const keyFile = fs.readFileSync(autoTlsHttpsConfig.keyFilePath);
                    const caFile = fs.readFileSync(autoTlsHttpsConfig.caFilePath);

                    axios.defaults.httpsAgent = new https.Agent({
                        cert: certFile,
                        key: keyFile,
                        ca: caFile
                    });

                    console.log("✅ Loaded SSL cert.")
                    return;

                } catch (err) {
                    if (err.code === 'ENOENT') {
                        console.warn("⚠ SSL cert files not set in config or unavailable, ignoring SSL...")
                        process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
                    }
                }

            } else {
                console.error(`❌ ${error.code}: Stable Diffusion was not found. Please verify that you are using the correct url and port in the sdConfig.json file.`)
                process.exit([1])
                
            }
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

    //Check for Ultimate SD upscale
    const scripts = await sendRequest('sdapi/v1/scripts', {}, "get");

    if (scripts.img2img.indexOf("ultimate sd upscale") == -1) {
        if (useUltimateSdUpscale) {
            console.warn("⚠ useUltimateSdUpscale is set to true but the extension was not detected, you can set this to false to use default sd upscaling instead.");
        }
    }

    //Check for controlnet
    if (extensionConfigs.controlnet.enabled) {
        axios.get(`${baseUrl}:${port}/controlnet/version`)
            .then(response => {
                console.log(`✅ ${response.status} ControlNet extension found.`);
            })
            .catch(error => {
                console.warn(`⚠ ${error.code}: ControlNet was not found. The /controlnet command will not work.`)
            })
    }
})();

eventHandler(client);

client.login(process.env.TOKEN);