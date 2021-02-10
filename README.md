<div align="center">
<p>
<img src="https://dummyimage.com/2x20/ff00ae/ff00ae.png" /></a>
<a href="https://discord.gg/qKHGJXZQSu"><img src="https://discord.com/api/guilds/793810017681276960/widget.png" alt="Discord Server" />
<img src="https://dummyimage.com/2x20/ff00ae/ff00ae.png" /></a>
</p>
</div>

# nekos-best.js
High quality nekos and role-playing GIFs powered by **[nekos.best](https://nekos.best)**!
This is a basic, lightweight API wrapper for the **[nekos.best](https://nekos.best)**'s API with built-in typings for our TypeScript folks out there!

Join the official support server **[here](https://discord.gg/qKHGJXZQSu)**

## Installation

```npm install nekos-best.js```

 - This module uses **[`centra`](https://www.npmjs.com/package/centra)** to make the API requests

## Methods

- `getRandom()` : Get a random image or GIF
- `getCuddle()` : Get a cuddling GIF
- `getTickle()` : Get a tickling GIF
- `getSlap()` : Get a slapping GIF
- `getKiss()` : Get a kissing GIF
- `getFeed()` : Get a feeding GIF
- `getPat()` : Get a patting GIF
- `getPoke()` : Get a poking GIF
- `getHug()` : Get a hugging GIF
- `getNeko()` : Get a neko GIF

## Usage

#### Get a neko:
```js
const NekoBestClient = require("nekos-best.js");
const client = new NekoBestClient();

const getNeko = async function() {
	console.log(await client.getNekos());
}

getNeko() //https://nekos.best/nekos/0001.png
```

#### Get a hug GIF:
```js
const NekoBestClient = require("nekos-best.js");
const client = new NekoBestClient();

const getHug = function() {
	client.getHug().then(console.log)
}

getHug() //https://nekos.best/hug/001.gif
```

#### Make a simple Discord Bot with [`discord.js`](https://www.npmjs.com/package/discord.js)

```js
const NekoBestClient = require("nekos-best.js");
const Discord = require("discord.js");

const discordClient = new Discord.Client();
const nekoClient = new NekoBestClient();

const TOKEN = ""; //Your bot token, don't share it with anyone!
const PREFIX = "!"; //Your bot's prefix

discordClient.once("ready", () => {
    console.log(`Logged in as ${discordClient.user.tag}`);
})

discordClient.on("message", async (message) => {
    if (message.author.bot) return;
    //Check if the user used the !neko command
    if (message.content.startsWith(`${PREFIX}neko`)) {
        message.channel.send(await nekoClient.getNekos());
    }
})

//Login to Discord
discordClient.login(TOKEN);
```