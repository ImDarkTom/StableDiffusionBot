const { baseUrl, port } = require('../../../sdConfig.json');
const axios = require('axios');

module.exports = async (path, data = {}, method = "post") => {
    if (method == "get") {
        const response = await axios.get(`${baseUrl}:${port}/${path}`, data)
        return response.data;
    }
    
    const response = await axios.post(`${baseUrl}:${port}/${path}`, data)
    return response.data;
};