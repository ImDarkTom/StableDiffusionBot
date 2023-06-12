
# StableDiffusionBot

![StableDiffusionBot Banner](https://i.imgur.com/eZ4lBjA.png)

A Discord Bot that uses Automatic1111's Stable Diffusion API to generate images.

![](https://img.shields.io/github/last-commit/ImDarkTom/StableDiffusionBot?style=flat-square)
[![License](https://img.shields.io/github/license/ImDarkTom/StableDiffusionBot?color=blue&style=flat-square)](#license)
## Features

- 512x512 image generation.
- Upscaling of images using Ultimate SD Upscale
- Saving images to direct messages and downloads
- Informative embeds on the generated images
## Screenshots

**Generation**
![Generation Embed](https://i.imgur.com/416fTR2.png)

**Upscaling**
![Upscale Emmbed](https://i.imgur.com/w5Ycl5w.png)
## Installation

Requirements:
- NodeJS
- Git

### 1. Prerequisites

**Stable Diffusion**

To be able to generate images you are going to need to setup [AUTOMATIC111's Stable Diffusion WebUI](https://github.com/AUTOMATIC1111/stable-diffusion-webui/) and make sure it is usable.

You will then need to add the `--api` argument to the COMMANDLINE_ARGS in the webui-user file. Other arguments like `--xformers` and `--medvram` can be used alongside the api argument. 

Verify that the api is functional by going to `http://(stable-diffusion-url):(port)/docs/`. 

**Bot Token**

Make sure you have created a discord bot token by going to the [Discord Developer Portal](https://discord.com/developers/applications), clicking `New Application`, going through the setup and inviting the bot into your server.

### 2. Installation

Clone the directory

`git clone https://github.com/ImDarkTom/StableDiffusionBot.git`

Navigate to the cloned directory

`cd StableDiffusionBot`

Download any needed packages with npm

`npm install`

### 3. Configuration

Create the `sdConfig.json`, `botConfig.json`, and `.env` files based off the examples provided. 

Modify the `.env` file with your bot token and configure the `botConfig.json` files with a testServer (id of server the bot was added to), clientId (bot's client id), and a list of user id's for `devs` (ids of people that you want to run devOnly commands).

sdConfig can but does not need to be modified if Stable Diffusion is using the default port.

### 4. Running the bot

Once all previous steps have been completed, the bot can be ran with the `node .` command. After a few seconds you should see an output saying the bot is online.

(Once running you may get an ExperimentalWarning about buffer.File when generating an image, you can ignore these)

(If the bot crashes on first image generation, try restaring it with Ctrl+C and `node .`, this is due to stable diffusion taking longer than expected during the fist image generation after startup)

