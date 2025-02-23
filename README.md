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

> [!CAUTION]
> Items annonated with `@package` and `@private` in their documentation are considered implementation details
> and are therefore subject to change **without** warning.

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

    if (message.content.startsWith("!neko")) {
        message.channel.send((await nekosBest.fetch("neko", 1)).results[0].url);
    }
});

discordClient.login(
    "************************.******.***************************",
);
```

## Migrations

Follow the [migration guide](./MIGRATIONS.md).
