// TODO Add documentation

import req from 'petitio'

const CATEGORIES = ['baka', 'bite', 'blush', 'bored', 'cry', 'cuddle', 'dance', 'facepalm', 'feed', 'happy', 'highfive', 'hug', 'kiss', 'laugh', 'neko', 'pat', 'poke', 'pout', 'shrug', 'slap', 'sleep', 'smile', 'smug', 'stare', 'think', 'thumbsup', 'tickle', 'wave', 'wink'] as const;
const BASE_URL = "https://nekos.best/api/v2";

export class Client {
    #endpointMetadata: Record<string, { format: string, min: string, max: string }> | null = null;
    #endpointTimeout?: NodeJS.Timeout;
    #endpointReq?: Promise<boolean>;

    constructor() { this.fetchEndpoints() }

    async fetchRandomFile(category: NB_CATEGORIES): Promise<NB_RESPONSE_WITH_BUFFER> {
        if (!CATEGORIES.includes(category)) throw new TypeError(`'${category}' is not a valid category. Available categories: ${CATEGORIES.join(', ')}`);
        if (!this.#endpointMetadata && !(await (this.#endpointReq == undefined ? this.fetchEndpoints() : this.#endpointReq)))
            throw new Error("Endpoints' metadata couldn't be fetched. Try again later");

        const metadata = this.#endpointMetadata![category]!
            , min = Number(metadata.min)
            , max = Number(metadata.max)
            , url = `${BASE_URL}/${category}/${(min + Math.floor(Math.random() * (max - min)))
                .toString()
                .padStart(metadata.max.length, '0')}.${metadata.format}`;

        const res = await req(url).send(), statusCodeKind = (res.statusCode || 0) / 100;
        if (statusCodeKind < 2 || statusCodeKind > 3) throw new Error(`Resource unavailable. Got status code ${res.statusCode}`);

        const body: NB_RESPONSE_WITH_BUFFER = JSON.parse(decodeURIComponent(res.headers['details'] || '{}'));
        body.data = res.body;

        return body;
    }

    async fetchMultiple(category: NB_CATEGORIES, amount = 5): Promise<NB_RESPONSE> {
        if (!CATEGORIES.includes(category)) throw new TypeError(`'${category}' is not a valid category. Available categories: ${CATEGORIES.join(', ')}`);
        amount = Math.max(Math.min(amount, 20), 1);
        return req(`${BASE_URL}/${category}?amount=${amount}`).json<NB_RESPONSE>();
    }

    async fetchRandom(category: NB_CATEGORIES): Promise<NB_RESPONSE> {
        if (!CATEGORIES.includes(category)) throw new TypeError(`'${category}' is not a valid category. Available categories: ${CATEGORIES.join(', ')}`);
        return req(`${BASE_URL}/${category}`).json<NB_RESPONSE>();
    }

    fetchEndpoints() { return this.#endpointReq = this.#fetchEndpoints().then((bool) => (this.#endpointReq = undefined, bool)); }

    async #fetchEndpoints() {
        if (this.#endpointTimeout) {
            clearTimeout(this.#endpointTimeout);
            this.#endpointTimeout = undefined;
        }

        const res = await req(`${BASE_URL}/endpoints`).send().catch(() => null);
        if (!res || res.statusCode != 200) return false;

        try { this.#endpointMetadata = res.json(); }
        catch { return false; }

        this.#endpointTimeout = setTimeout(() => this.fetchEndpoints(), 7_200_000);
        return true;
    }
}

export function fetchRandom(category: NB_CATEGORIES) {
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

export type NB_RESPONSE_WITH_BUFFER = {
    artist_href?: string
    artist_name?: string
    source_url?: string
    anime_name?: string
    data: Buffer
}
