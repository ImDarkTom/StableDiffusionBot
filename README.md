# Stable Diffusion Bot

A discord.js bot that uses [Automatic1111's Stable Diffusion Web API](https://github.com/AUTOMATIC1111/stable-diffusion-webui/wiki/API) and slash commands in order to have users be able to generate images with stable diffusion straight from Discord.
## External Libraries

- [Automatic1111's Stable Diffusion API](https://github.com/AUTOMATIC1111/stable-diffusion-webui/wiki/API)
- Discord.js
- Axios
## Installation

Clone the repository

```bash
git clone https://github.com/ImDarkTom/StableDiffusionBot/
```
    
Set up .env file with your bot's token
```bash
TOKEN = bot_token
```

Create the config.json file
```json
{
    "testServer": "testing_guild_id",
    "clientId": "bot_user_id",
    "devs": ["developer_user_id"]
}
```

Run Stable Diffusion WebUI with api, this can be done by adding the argument `--api` in the commandline args in the `webui-user.bat` file.

Run the bot
```bash
node .\src\index.js
```
or
```bash
node .
```
## License

[MIT](https://choosealicense.com/licenses/mit/)
