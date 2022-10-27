
import fetch from "node-fetch";

const CATEGORIES = [
    "baka", "bite", "blush",
    "bored", "cry", "cuddle",
    "dance", "facepalm", "feed",
    "happy", "highfive", "hug",
    "kiss", "kitsune", "laugh",
    "neko", "pat", "poke",
    "pout", "shrug", "slap",
    "sleep", "smile", "smug",
    "stare", "think", "thumbsup",
    "tickle", "wave", "wink",
    "waifu", "kick", "handhold",
    "punch", "shoot", "husbando",
    "yeet"
] as const;

type Nullable<T> = T | undefined | null;
type EndpointMetadata = Record<string, {
    format: string;
    min: string;
    max: string;
}>;

export type NB_CATEGORIES = typeof CATEGORIES[number];
export type NB_RESPONSE = {
    results: {
        artist_href?: string
        artist_name?: string
        source_url?: string
        anime_name?: string
        url: string
    }[]
}
export type NB_BUFFER_RESPONSE = {
    artist_href?: string
    artist_name?: string
    source_url?: string
    anime_name?: string
    data: Buffer
}

/**
 * A quick function to fetch a random file URL along with its metadata (if available).
 *
 * If you are going to call this function multiple times, it's better to initialize a new `Client` instead.
 *
 * @param category The category to fetch the file URL from. If omitted, it picks a random category.
 */
export async function fetchRandom(category?: NB_CATEGORIES) {
    return new Client().fetch(category, 1);
}

export default Client;
export class Client {
    #endpointMetadata: EndpointMetadata | null = null;

    /**
     * Fetches and downloads a random file with its metadata (if available).
     * For more advanced options, you should use the `Client.fetch()` method and
     * fetch the file yourself.
     *
     * Refer to the documentation for more details: https://docs.nekos.best/api/endpoints.html#get-categoryfilenameformat
     *
     * @param category The category to download from.
     */
    async fetchFile(category: NB_CATEGORIES): Promise<NB_BUFFER_RESPONSE> {
        if (!CATEGORIES.includes(category)) {
            throw new TypeError(`"${category}" is not a valid category. Available categories: ${CATEGORIES.join(", ")}`);
        }

        if (!this.#endpointMetadata) {
            this.#endpointMetadata = await fetchJson<EndpointMetadata>("endpoints");
        }

        const metadata = this.#endpointMetadata[category]!;
        const min = Number(metadata.min);
        const max = Number(metadata.max);

        const response = await fetchPath(
            `${category}/${(min + Math.floor(Math.random() * (max - min)))
                .toString()
                .padStart(metadata.max.length, "0")}.${metadata.format}`
        );

        return {
            artist_href: response.headers.get("artist_href") || void 0,
            artist_name: response.headers.get("artist_name") || void 0,
            anime_name: response.headers.get("anime_name") || void 0,
            source_url: response.headers.get("source_url") || void 0,
            data: Buffer.from(await response.arrayBuffer()),
        };
    }

    /**
     * Fetches multiple assets with their metadata (if available).
     *
     * Refer to the documentation for more details: https://docs.nekos.best/api/endpoints.html#get-categoryamountx
     *
     * @param category Category of assets. Set to `null` to pick a random category.
     * @param amount The amount of assets. Refer to the documentation for the limits.
     */
    async fetch(category: Nullable<NB_CATEGORIES> = null, amount: number): Promise<NB_RESPONSE> {
        if (!category) {
            category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
        }

        if (!CATEGORIES.includes(category)) {
            throw new TypeError(`"${category}" is not a valid category. Available categories: ${CATEGORIES.join(", ")}`);
        }

        if (!Number.isSafeInteger(amount)) {
            throw new TypeError(`Expected a safe integer for amount. Got "${amount}".`);
        }

        return fetchJson<NB_RESPONSE>(`${category}?amount=${amount}`);
    }
}

async function fetchPath(path: string) {
    const response = await fetch(`https://nekos.best/api/v2/${path}`, {
        headers: { "User-Agent": "nekos-best.js / 6.0.0" },
        redirect: "follow",
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch "${path}". Got status code ${response.status}.`);
    }

    return response;
}

async function fetchJson<T>(path: string): Promise<T> {
    return await (await fetchPath(path)).json() as T;
}
