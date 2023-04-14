const { ActivityType } = require('discord.js');
const axios = require('axios');

module.exports = (client) => {
    console.log(`✅ ${client.user.tag} is online.`);

    client.user.setPresence({
        activities: [{ name: `SD starting...`, type: ActivityType.Watching }],
        status: 'dnd',
    });

    function checkSite() {
        setTimeout(async () => {
            try {
                let req = await axios.get('http://127.0.0.1:7860/');
                if (req.status == 200) {
                    console.log('🎨 SD is running!');
                    client.user.setPresence({
                        activities: [{ name: `/generate`, type: ActivityType.Playing }],
                        status: 'online',
                    });
                } else {
                    console.log('🕔 SD is still starting...');
                    checkSite();
                }
            } catch (error) {
                console.log('🕔 SD is still starting...');
                checkSite();
            }
        }, 3000);
    }

    checkSite();
};