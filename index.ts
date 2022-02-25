import req from 'petitio'

const CATEGORIES = ['baka', 'bite', 'blush', 'bored', 'cry', 'cuddle', 'dance', 'facepalm', 'feed', 'happy', 'highfive', 'hug', 'kiss', 'laugh', 'neko', 'pat', 'poke', 'pout', 'shrug', 'slap', 'sleep', 'smile', 'smug', 'stare', 'think', 'thumbsup', 'tickle', 'wave', 'wink'] as const;
const BASE_URL = "https://nekos.best/api/v2";
const USER_AGENT = "nekos-best.js / 5.0.0";

export class Client {
    #endpointMetadata: Record<string, { format: string, min: string, max: string }> | null = null;
    #endpointTimeout?: NodeJS.Timeout;
    #initialized = false;

    /**
     * Loads this client and:
     * * Fetches from `/api/v2/endpoints`
     */
    async init(): Promise<this> {
        if (this.#initialized) throw new Error('Client has already been initialized.');

        await this.#fetchEndpoints(true);
        this.#initialized = true;

        return this;
    }

    /**
     * Downloads a random file along with its metadata (if available).
     * @param category The category to download from.
     */
    async fetchFile(category: NB_CATEGORIES): Promise<NB_BUFFER_RESPONSE> {
        if (this.#endpointMetadata == null) throw new Error("Client has not been initialized. Call the <Client>.init() method.")
        if (!CATEGORIES.includes(category)) throw new TypeError(`'${category}' is not a valid category. Available categories: ${CATEGORIES.join(', ')}`);

        const metadata = this.#endpointMetadata[category]!
            , min = Number(metadata.min)
            , max = Number(metadata.max)
            , url = `${BASE_URL}/${category}/${(min + Math.floor(Math.random() * (max - min)))
                .toString()
                .padStart(metadata.max.length, '0')}.${metadata.format}`;
        const response = await req(url)
            .header("User-Agent", USER_AGENT)
            .send()
            , statusCodeKind = (response.statusCode || 0) / 100;

        if (statusCodeKind < 2 || statusCodeKind > 3) {
            throw new Error(`Resource unavailable. Got status code ${response.statusCode}.`);
        }

        return {
            artist_href: response.headers['artist_href'],
            anime_name: response.headers['anime_name'],
            source_url: response.headers['source_url'],
            artist_name: response.headers['artist_name'],
            data: response.body
        };
    }

    /**
     * Fetches multiple file URLs along with its metadata (if available).
     * @param category The category to fetch multiple file URLs from.
     * @param amount The amount of file URLs. It must be an integer between `1 ≤ x ≤ 20`
     */
    async fetchMultiple(category: NB_CATEGORIES, amount = 5): Promise<NB_RESPONSE> {
        if (!CATEGORIES.includes(category)) throw new TypeError(`'${category}' is not a valid category. Available categories: ${CATEGORIES.join(', ')}`);
        if (!Number.isSafeInteger(amount)) throw new TypeError(`Expected a safe integer for amount. Got '${amount}'.`);
        return req(`${BASE_URL}/${category}?amount=${Math.max(Math.min(Math.floor(amount), 20), 1)}`)
            .header("User-Agent", USER_AGENT)
            .json<NB_RESPONSE>();
    }

    /**
     * Fetches a random file URL along with its metadata (if available).
     * @param category The category to fetch the file URL from. If omitted, it picks a random category.
     */
    async fetchRandom(category: NB_CATEGORIES | null = null): Promise<NB_RESPONSE> {
        if (category != null && !CATEGORIES.includes(category)) throw new TypeError(`'${category}' is not a valid category. Available categories: ${CATEGORIES.join(', ')}`);
        return req(`${BASE_URL}/${category || CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)]}`)
            .header("User-Agent", USER_AGENT)
            .json<NB_RESPONSE>();
    }

    /** Fetches from `/api/v2/endpoints`*/
    async fetchEndpoints(): Promise<boolean> {
        if (!this.#initialized) throw new Error('Client must be already initialized before calling this method.');
        return this.#fetchEndpoints(true);
    }

    async #fetchEndpoints(throwOnError: boolean): Promise<boolean> {
        if (this.#endpointTimeout) {
            clearTimeout(this.#endpointTimeout);
            this.#endpointTimeout = undefined;
        }

        const response = await req(`${BASE_URL}/endpoints`)
            .header("User-Agent", USER_AGENT)
            .send().catch(() => null);

        if (!response || response.statusCode != 200) {
            if (throwOnError) throw new Error(`Couldn't fetch /endpoints. Got status code ${response?.statusCode || null}.`);
            return false;
        }

        try { this.#endpointMetadata = response.json(); }
        catch (err) {
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
