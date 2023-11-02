const { baseUrl, port } = require('../../../sdConfig.json');
const axios = require('axios');

/**
 * 
 * @param {string} path API URL path e.g 'sdapi/v1/txt2img'
 * @param {object} data Data to be sent with request.
 * @param {import('axios').Method} method 
 * @returns {Promise<object>}
 */
module.exports = async (path, data = {}, method = "post") => {
    const response = await axios({
        method: method,
        url: `${baseUrl}:${port}/${path}`,
        data: data
    });

    return response.data;
};