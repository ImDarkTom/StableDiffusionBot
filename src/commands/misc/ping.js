module.exports = {
    name: 'ping',
    description: "Checks the bot's status",
    // devOnly: Boolean,
    // testOnly: Boolean,
    // options: Object[],
    // deleted: true,

    callback: async (client, interaction) => {
        await interaction.deferReply();

        const reply = await interaction.fetchReply();

        const ping = reply.createdTimestamp - interaction.createdTimestamp;

        interaction.reply(`Pong! Client: ${ping}ms, Websocket: ${client.ws.ping}ms`);
    },
};