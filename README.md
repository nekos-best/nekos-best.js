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

`npm install nekos-best.js` | `yarn add nekos-best.js` | `pnpm install nekos-best.js`

## Usage

```js
import { Client, fetchRandom } from "nekos-best.js";

// You can use the `fetchRandom()` function to fetch a random neko.
console.log(await fetchRandom("neko")); // { results: [{ artist_href: '···', artist_name: '···', source_url: '···', url: 'https://nekos.best/api/v2/neko/XXXXX-XXXXX.png' }] }

// Alternatively, you can initialize a new client which offers more features.
const nekosBest = new Client();

// Such as the `<Client>.fetch()` method.
console.log(await nekosBest.fetch("neko", 1)); // { results: [{ artist_href: '···', artist_name: '···', source_url: '···', url: 'https://nekos.best/api/v2/neko/XXXXX-XXXXX.png' }] }
console.log(await nekosBest.fetch("hug", 10)); // { results: [{ artist_href: '···', artist_name: '···', source_url: '···', url: 'https://nekos.best/api/v2/hug/XXXXX-XXXXX.gif' }, ···] }

// Or the `<Client>.fetchFile()` method to get a single file.
console.log(await nekosBest.fetchFile("neko")); // { artist_href: '···', ···, data: <Buffer> }
```

### Build a simple Discord Bot with [`discord.js`](https://www.npmjs.com/package/discord.js)

```js
import { Client as DiscordClient } from "discord.js";
import { Client } from "nekos-best.js";

const discordClient = new DiscordClient();
const nekosBest = new Client();

discordClient.on("messageCreate", async (message) => {
    if (message.author.bot) return;

    if (message.content.startsWith('!neko')) {
        message.channel.send((await nekosBest.fetch("neko", 1)).results[0].url);
    }
})

discordClient.login("************************.******.***************************");
```

## Migrate from 5.X.X to 6.X.X

**❗ For the TypeScript users, the type `NbEndpointMetadata` will be removed in the 7.X.X version due to recent API changes**

### `<Client>.fetchRandom()` & `<Client>.fetchMultiple()` methods have been removed in favor of the `<Client>.fetch(category, amount)` method

```diff
const nekosBest = new Client();

- nekosBest.fetchRandom("neko")
+ nekosBest.fetch("neko", 1)
```

```diff
const nekosBest = new Client();

- nekosBest.fetchMultiple("neko", 15)
+ nekosBest.fetch("neko", 15)
```

### The `<Client>.init()` method has been removed

```diff
const nekosBest = new Client();

- await nekosBest.init();
```

## Migrate from 4.X.X to 5.X.X

### The `fetchNeko(category)` function has been removed in favor of the `<Client>.fetchRandom()` method and its shortcut `fetchRandom()`

```diff
- fetchNeko('category')
+ const nekosBest = new Client();
+
+ nekosBest.fetchRandom('category')
```

```diff
- fetchNeko('category')
+ fetchRandom('category')
```

### The optional parameter `amount` of the `fetchNeko()` function has been removed in favor of the `<Client>.fetchMultiple()` method

```diff
- fetchNeko('category', 15)
+ const nekosBest = new Client();
+
+ nekosBest.fetchMultiple('category', 15)
```

### Other Changes

- The optional options `max` and `min` of the `fetchNeko()` function have been removed
