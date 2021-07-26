<div align="center">
    <p>
        <img src="https://dummyimage.com/2x20/ff00ae/ff00ae.png" /> 
        <a href="https://discord.gg/AsYnNuGcMj">
            <img src="https://img.shields.io/discord/793810017681276960?maxAge=3600&style=flat&logo=discord&color=619cf8&logoColor=white" alt="Discord Server" />
        </a>
        <img src="https://dummyimage.com/2x20/ff00ae/ff00ae.png" />
		<a href="https://www.npmjs.com/package/nekos-best.js">
        	<img src="https://img.shields.io/npm/v/nekos-best.js.svg?maxAge=3600&style=flat&logo=npm&color=ff5540" alt="Version" />
		</a>
        <img src="https://dummyimage.com/2x20/ff00ae/ff00ae.png" />
		<a href="https://www.npmjs.com/package/nekos-best.js">
        	<img src="https://img.shields.io/npm/dt/nekos-best.js.svg?maxAge=3600&style=flat&logo=npm&color=ff5540" alt="Downloads" />
		</a>
        <img src="https://dummyimage.com/2x20/ff00ae/ff00ae.png" />
    </p>
</div>

# [nekos-best.js](https://www.npmjs.com/package/nekos-best.js)
High quality nekos and role-playing GIFs powered by **[nekos.best](https://nekos.best)**!
This is a basic, lightweight API wrapper for the **[nekos.best](https://nekos.best)**'s API with built-in typings for our TypeScript folks out there!
**[Node LTS](https://nodejs.org/en/download/)** is recommended.

Join the official Discord server **[here](https://nekos.best/discord?ref=js)**

## Installation

```npm install nekos-best.js```

 - This module uses **[`petitio`](https://www.npmjs.com/package/petitio)** to make the API requests

## Usage

### Get a neko
```js

const getNeko = async function() {
	console.log(await fetchNeko('nekos'));
}

getNeko() // { url: 'https://nekos.best/nekos/0001.png', artist_href: '···', artist_name: '···', source_url: '···' }
```

### Get a hug GIF
```js
const { fetchNeko } = require("nekos-best.js");

const getHug = function() {
	fetchNeko('hug').then(console.log)
}

getHug() // { url: 'https://nekos.best/hug/001.gif', artist_href: '···', artist_name: '···', source_url: '···' }
```

### Get multiple hug GIFs
```js
const { fetchNeko } = require("nekos-best.js");

fetchNeko('hug', 15).then(console.log) // [ { url: 'https://nekos.best/hug/001.gif', artist_href: '···', artist_name: '···', source_url: '···' }, { url: 'https://nekos.best/hug/002.gif', artist_href: '···', artist_name: '···', source_url: '···' } ... ]
```

### Build a simple Discord Bot with [`discord.js`](https://www.npmjs.com/package/discord.js)

```js
const { fetchNeko } = require("nekos-best.js");
const Discord = require("discord.js");

const discordClient = new Discord.Client();

const TOKEN = "abc123";
const PREFIX = "!";

discordClient.once("ready", () => {
    console.log(`Logged in as ${discordClient.user.tag}`);
})

discordClient.on("message", async (message) => {
    if (message.author.bot) return;
    //Check if the user used the !neko command
    if (message.content.startsWith(`${PREFIX}neko`)) {
        message.channel.send(await fetchNeko('nekos'));
    }
})

//Login to Discord
discordClient.login(TOKEN);
```
