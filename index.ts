import type { RequestInfo, RequestInit } from 'node-fetch';

const fetch = (url: URL | RequestInfo, init?: RequestInit) =>
    import('node-fetch').then(({ default: fetch }) => fetch(url, init));

const IMAGE_CATEGORIES = ["kitsune", "neko", "husbando", "waifu"] as const;
const GIF_CATEGORIES = [
    "baka", "bite", "blush",
    "bored", "cry", "cuddle",
    "dance", "facepalm", "feed",
    "happy", "highfive", "hug",
    "kiss", "laugh", "pat",
    "pout", "shrug", "slap",
    "sleep", "smile", "smug",
    "stare", "think", "thumbsup",
    "tickle", "wave", "wink",
    "kick", "handhold", "punch",
    "shoot", "yeet", "poke",
    "nod", "nom", "nope",
    "handshake", "lurk", "peck",
    "yawn",
] as const;


interface RatelimitData {
    remaining: number,
    resetsIn: number,
}

type Nullable<T> = T | undefined | null;

export type NbCategories = typeof GIF_CATEGORIES[number] | typeof IMAGE_CATEGORIES[number];

/** @deprecated This will be removed in the next major version */
export type NbEndpointMetadata = Record<string, {
    format: string;
    min: string;
    max: string;
}>;

// NbResponse was taken :(
export type NbIndividualResponse = {
    artist_href?: string
    artist_name?: string
    source_url?: string
    anime_name?: string
    url: string
}

export type NbResponse = { results: NbIndividualResponse[] }
export type NbBufferResponse = NbIndividualResponse & { data: Buffer }

export type RatelimitHandleMode = "sleep" | "throw";

export interface ClientOptions {
    ratelimitHandleMode: RatelimitHandleMode
}

/**
 * A quick function to fetch a random file URL along with its metadata (if available).
 *
 * If you are going to call this function multiple times, it's better to initialize a new `Client` instead.
 *
 * @param category The category to fetch the file URL from. If omitted, it picks a random category.
 */
export async function fetchRandom(category?: NbCategories) {
    return new Client().fetch(category, 1);
}

export class Client {
    #ratelimitData: RatelimitData | null = null;
    #clientOptions: ClientOptions;

    constructor(clientOptions?: Partial<NbBufferResponse>) {
        this.#clientOptions = {
            ratelimitHandleMode: "sleep",
            ...clientOptions,
        };
    }

    /**
     * Fetch and download a random file with its metadata (if available).
     * For more advanced options, you should use the `Client.fetch()` method and
     * fetch the file by yourself.
     *
     * Refer to the documentation for more details: https://docs.nekos.best/api/endpoints.html#get-categoryfilenameformat
     *
     * @param category The category to download from.
     */
    async fetchFile(category: Nullable<NbCategories> = null): Promise<NbBufferResponse> {
        // The fetch() method performs the `category` validation
        const fileDetails = (await this.fetch(category, 1)).results[0];
        const file = (await fetchPath(void 0, fileDetails.url))

        return {
            ...fileDetails,
            data: Buffer.from(await file.arrayBuffer()),
        }
    }

    /**
     * Fetch multiple assets with their metadata (if available).
     *
     * Refer to the documentation for more details: https://docs.nekos.best/api/endpoints.html#get-categoryamountx
     *
     * @param category Category of assets. Set to `null` to pick a random category.
     * @param amount The amount of assets. Refer to the documentation for the limits.
     */
    async fetch(category: Nullable<NbCategories> = null, amount: number): Promise<NbResponse> {
        if (!category) {
            category = pickRandomCategory();
        } else {
            validateCategory(category);
        }

        if (!Number.isSafeInteger(amount)) {
            throw new TypeError(`Expected a safe integer for amount. Got "${amount}".`);
        }

        return fetchJson(`${category}?amount=${amount}`);
    }

    /**
     * Search for assets.
     *
     * Refer to the documentation for more details: https://docs.nekos.best/api/endpoints.html#get-searchqueryxtypexcategoryxamountx
     *
     * @param query Search query.
     * @param category Category of assets. Set to `null` to pick a random category.
     * @param amount The amount of assets. Refer to the documentation for the limits.
     */
    async search(query: string, category: Nullable<NbCategories> = null, amount = 1): Promise<NbResponse> {
        if (this.#ratelimitData != null) {
            await handleRatelimit(this.#clientOptions.ratelimitHandleMode, this.#ratelimitData);
        }

        if (!category) {
            category = pickRandomCategory();
        } else {
            validateCategory(category);
        }

        if (!Number.isSafeInteger(amount)) {
            throw new TypeError(`Expected a safe integer for amount. Got "${amount}".`);
        }

        // Type 1 is images so if `category` is in `IMAGE_CATEGORIES`, the result will be 2 - 1 = 1
        // Type 2 is for GIFs; 2 - 0 = 2
        const type = 2 - +IMAGE_CATEGORIES.includes(category as never);
        const response = await fetchPath(`search?query=${encodeURIComponent(query)}&type=${type}&category=${category}&amount=${amount}`);

        const remaining = response.headers.get("x-rate-limit-remaining");
        const resetsIn = response.headers.get("x-rate-limit-reset");

        if (remaining != null && resetsIn != null) {
            this.#ratelimitData = {
                resetsIn: Date.parse(resetsIn),
                remaining: Number(remaining),
            }
        }

        return await response.json() as NbResponse;
    }
}

// The parameters are a bit ugly but who cares, it's a private function
async function fetchPath(path?: string, fullUrl: Nullable<string> = null) {
    const url = fullUrl || `https://nekos.best/api/v2/${path}`;
    const response = await fetch(url, {
        headers: { "User-Agent": "nekos-best.js / 6.0.0" },
        redirect: "follow",
    });

    if (!response.ok) {
        const text = await response.text();

        throw new Error(`Failed to fetch url "${url}" (status code ${response.status}): ${text}`);
    }

    return response;
}

export default Client;

async function fetchJson<T>(path: string): Promise<T> {
    return await (await fetchPath(path)).json() as T;
}

function validateCategory(category: string) {
    if (!(IMAGE_CATEGORIES.includes(category as never) || GIF_CATEGORIES.includes(category as never))) {
        throw new TypeError(`"${category}" is not a valid category. Available categories: ${IMAGE_CATEGORIES.join(", ")}, ${GIF_CATEGORIES.join(", ")}`);
    }
}

function pickRandomCategory(): NbCategories {
    const idx = Math.random() * (GIF_CATEGORIES.length + IMAGE_CATEGORIES.length) | 0;

    if (idx < IMAGE_CATEGORIES.length) {
        return IMAGE_CATEGORIES[idx];
    }

    return GIF_CATEGORIES[idx - IMAGE_CATEGORIES.length];
}

async function handleRatelimit(mode: RatelimitHandleMode, data: RatelimitData) {
    const now = Date.now();

    if (data.remaining <= 0 && data.resetsIn > now) {
        switch (mode) {
            case "sleep":
                await new Promise(resolve => setTimeout(resolve, data.resetsIn - now));
                return;
            case "throw":
                throw Error("You are being ratelimited");
        }
    }

    --data.remaining;
}
