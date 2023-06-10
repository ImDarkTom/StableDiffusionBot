const { baseUrl, port } = require('../../../sdConfig.json');
const axios = require('axios');

module.exports = async (path, data) => {
    const imageData = await axios.post(`${baseUrl}:${port}/${path}`, data)
    return imageData.data;
};