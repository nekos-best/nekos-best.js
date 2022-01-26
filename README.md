<!-- markdownlint-disable MD033 MD041 -->
<div align="center">
    <p>
        <a href="https://nekos.best/discord?ref=js">
            <img src="https://img.shields.io/discord/793810017681276960?maxAge=3600&style=flat&logo=discord&color=619cf8&logoColor=white" alt="Discord Server" />
        </a>
        <a href="https://www.npmjs.com/package/nekos-best.js">
            <img src="https://img.shields.io/npm/v/nekos-best.js.svg?maxAge=3600&style=flat&logo=npm&color=ff5540" alt="Version" />
        </a>
        <a href="https://www.npmjs.com/package/nekos-best.js">
            <img src="https://img.shields.io/npm/dt/nekos-best.js.svg?maxAge=3600&style=flat&logo=npm&color=ff5540" alt="Downloads" />
        </a>
    </p>
</div>

# [nekos-best.js](https://www.npmjs.com/package/nekos-best.js)

High quality nekos and role-playing GIFs powered by **[nekos.best](https://nekos.best)**!
This is the official API wrapper for the **[nekos.best](https://nekos.best)**'s API with built-in TypeScript typings.
**[Node LTS](https://nodejs.org/en/download/)** is recommended.

Join the official Discord server **[here](https://nekos.best/discord?ref=js)**

## Installation

```npm install nekos-best.js```

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

fetchNeko('hug').then(console.log) // { url: 'https://nekos.best/hug/001.gif', anime_name: '···' }
```

### Get multiple hug GIFs

```js
const { fetchNeko } = require("nekos-best.js");

fetchNeko('hug', 15).then(console.log) // [ { url: 'https://nekos.best/hug/001.gif', anime_name: '···' }, { url: 'https://nekos.best/hug/006.gif', anime_name: '···' } ··· ]
```

### Build a simple Discord Bot with [`discord.js`](https://www.npmjs.com/package/discord.js)

```js
const { fetchNeko } = require("nekos-best.js");
const { Client } = require("discord.js");

const TOKEN = "************************.******.***************************";

const discordClient = new Client();

discordClient.once("ready", () => {
    console.log(`Logged in as ${discordClient.user.tag}`);
})

discordClient.on("messageCreate", async (message) => {
    if (message.author.bot) return;

    if (message.content.startsWith('!neko')) {
        message.channel.send(await fetchNeko('nekos')).catch(console.error);
    }
})

discordClient.login(TOKEN);
```
