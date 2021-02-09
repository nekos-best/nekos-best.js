# nekos-best
High quality nekos and role-playing GIFs powered by [nekos.best](https://nekos.best)!
This is a basic API wrapper for the [nekos.best](https://nekos.best)'s API with built-in typings for our TypeScript folks out there!

## Installation

```npm install nekos-best```

 - This module uses **[`centra`](https://www.npmjs.com/package/centra)** to make the API requests

## Usage

#### To get a neko: 
```js
const NekoBestClient = require("nekos-best");
const client = new NekoBestClient();

const getNeko = async function() {
	console.log(await client.getNekos());
}

getNeko() //https://nekos.best/nekos/0001.png
```

#### To get a hug GIF:
```js
const NekoBestClient = require("nekos-best");
const client = new NekoBestClient();

const getHug = function() {
	client.getHug().then(gif => console.log(gif))
}

getHug() //https://nekos.best/hug/001.gif
```