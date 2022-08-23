
import fetch from "node-fetch";

const CATEGORIES = ["baka", "bite", "blush", "bored", "cry", "cuddle", "dance", "facepalm", "feed", "happy", "highfive", "hug", "kiss", "kitsune", "laugh", "neko", "pat", "poke", "pout", "shrug", "slap", "sleep", "smile", "smug", "stare", "think", "thumbsup", "tickle", "wave", "wink", "waifu", "kick", "handhold", "punch", "shoot", "husbando", "yeet"] as const;

async function fetchPath(path: string) {
    const response = await fetch(`https://nekos.best/api/v2/${path}`, {
        headers: { "User-Agent": "nekos-best.js / 5.3.0" },
        redirect: "follow",
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch "${path}". Got status code ${response.status}.`);
    }

    return response;
}

async function fetchJson<T>(path: string): Promise<T> {
    const response = await fetchPath(path);
    return await response.json() as T;
}

export class Client {
    #endpointMetadata: Record<string, { format: string, min: string, max: string }> | null = null;
    #endpointTimeout?: NodeJS.Timeout;
    #initialized = false;

    /**
     * Loads this client and:
     * * Fetches from `/api/v2/endpoints`
     */
    async init(): Promise<this> {
        if (this.#initialized) throw new Error("Client has already been initialized.");

        await this.#fetchEndpoints(true);
        this.#initialized = true;

        return this;
    }

    /**
     * Downloads a random file along with its metadata (if available).
     * @param category The category to download from.
     */
    async fetchFile(category: NB_CATEGORIES): Promise<NB_BUFFER_RESPONSE> {
        if (this.#endpointMetadata == null) {
            throw new Error("Client has not been initialized. Call the <Client>.init() method.");
        } else if (!CATEGORIES.includes(category)) {
            throw new TypeError(`"${category}" is not a valid category. Available categories: ${CATEGORIES.join(", ")}`);
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
            artist_href: response.headers.get("artist_href")!,
            anime_name: response.headers.get("anime_name")!,
            source_url: response.headers.get("source_url")!,
            artist_name: response.headers.get("artist_name")!,
            data: Buffer.from(await response.arrayBuffer()),
        };
    }

    /**
     * Fetches multiple file URLs along with its metadata (if available).
     * @param category The category to fetch multiple file URLs from.
     * @param amount The amount of file URLs. It must be an integer between `1 ≤ x ≤ 20`
     */
    async fetchMultiple(category: NB_CATEGORIES, amount = 5): Promise<NB_RESPONSE> {
        if (!CATEGORIES.includes(category)) {
            throw new TypeError(`"${category}" is not a valid category. Available categories: ${CATEGORIES.join(", ")}`);
        } else if (!Number.isSafeInteger(amount)) {
            throw new TypeError(`Expected a safe integer for amount. Got "${amount}".`);
        }

        return fetchJson<NB_RESPONSE>(`${category}?amount=${Math.max(Math.min(Math.floor(amount), 20), 1)}`);
    }

    /**
     * Fetches a random file URL along with its metadata (if available).
     * @param category The category to fetch the file URL from. If omitted, it picks a random category.
     */
    async fetchRandom(category: NB_CATEGORIES | null = null): Promise<NB_RESPONSE> {
        if (category != null && !CATEGORIES.includes(category)) {
            throw new TypeError(`"${category}" is not a valid category. Available categories: ${CATEGORIES.join(", ")}`);
        }

        return fetchJson<NB_RESPONSE>(category || CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)]);
    }

    /** Fetches from `/api/v2/endpoints`*/
    async fetchEndpoints(): Promise<boolean> {
        if (!this.#initialized) {
            throw new Error("Client must be already initialized before calling this method.");
        }

        return this.#fetchEndpoints(true);
    }

    async #fetchEndpoints(throwOnError: boolean): Promise<boolean> {
        if (this.#endpointTimeout) {
            clearTimeout(this.#endpointTimeout);
            this.#endpointTimeout = undefined;
        }

        try {
            this.#endpointMetadata = await fetchJson("endpoints");
        } catch (err) {
            if (throwOnError) throw err;
            return false;
        }

        this.#endpointTimeout = setTimeout(() => this.#fetchEndpoints(false), 7_200_000);
        return true;
    }
}

export default Client;

/**
 * A quick function to fetch a random file URL along with its metadata (if available).
 * 
 * If you are going to call this function multiple times, it's better to initialize a new `Client` instead.
 * @param category The category to fetch the file URL from. If omitted, it picks a random category.
 */
export async function fetchRandom(category?: NB_CATEGORIES) {
    return new Client().fetchRandom(category);
}

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
