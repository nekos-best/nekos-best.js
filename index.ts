
import fetch from "node-fetch";


const IMAGE_CATEGORIES = ["kitsune", "neko"] as const;
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
    "waifu", "kick", "handhold",
    "punch", "shoot", "husbando",
    "yeet", "poke",
] as const;

type Nullable<T> = T | undefined | null;

export type NbCategories = typeof GIF_CATEGORIES[number] | typeof IMAGE_CATEGORIES[number];
export type NbEndpointMetadata = Record<string, {
    format: string;
    min: string;
    max: string;
}>;
export type NbBufferResponse = {
    artist_href?: string
    artist_name?: string
    source_url?: string
    anime_name?: string
    data: Buffer
};
export type NbResponse = {
    results: {
        artist_href?: string
        artist_name?: string
        source_url?: string
        anime_name?: string
        url: string
    }[]
};

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

export default Client;
export class Client {
    #endpointMetadata: NbEndpointMetadata | null = null;

    /**
     * Fetch and download a random file with its metadata (if available).
     * For more advanced options, you should use the `Client.fetch()` method and
     * fetch the file yourself.
     *
     * Refer to the documentation for more details: https://docs.nekos.best/api/endpoints.html#get-categoryfilenameformat
     *
     * @param category The category to download from.
     */
    async fetchFile(category: NbCategories): Promise<NbBufferResponse> {
        validateCategory(category);

        if (!this.#endpointMetadata) {
            this.#endpointMetadata = await fetchJson<NbEndpointMetadata>("endpoints");
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
    async search(query: string, category: Nullable<NbCategories> = null, amount: number): Promise<NbResponse> {
        if (!category) {
            category = pickRandomCategory();
        } else {
            validateCategory(category);
        }

        if (!Number.isSafeInteger(amount)) {
            throw new TypeError(`Expected a safe integer for amount. Got "${amount}".`);
        }

        const type = 2 - +IMAGE_CATEGORIES.includes(category as never);

        return fetchJson(`search?query=${encodeURIComponent(query)}&type=${type}&category=${category}&amount=${amount}`);
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

function validateCategory(category: string) {
    if (!(IMAGE_CATEGORIES.includes(category as never) || GIF_CATEGORIES.includes(category as never))) {
        throw new TypeError(`"${category}" is not a valid category. Available categories: ${IMAGE_CATEGORIES.join(", ")}${GIF_CATEGORIES.join(", ")}`);
    }
}

function pickRandomCategory(): NbCategories {
    const idx = Math.random() * (GIF_CATEGORIES.length + IMAGE_CATEGORIES.length) | 0;

    if (idx < IMAGE_CATEGORIES.length) {
        return IMAGE_CATEGORIES[idx];
    }

    return GIF_CATEGORIES[idx - IMAGE_CATEGORIES.length];
}
