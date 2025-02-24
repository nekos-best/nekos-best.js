import { Client } from "nekos-best.js";

const client = new Client();

const gifAssets = await client.fetchGifAssets("bored", 10);
const pngAssets = await client.fetchPngAssets("neko", 20);
