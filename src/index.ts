// TODO: Rename png to static and gif to animated.

import type { Categories, GifAssetMetadata, GifCategories, PngAssetMetadata, PngCategories, AssetFormat, EndpointsResponse, SearchResponse, MixedAssetMetadata } from "./types.js";

import { randomIn, sleepAsync, validateAnyIn, validatePosInteger } from "./utils.js";
import { CATEGORIES } from "./constants.js";

export type * from "./types.js";

const DEFAULT_AMOUNT = 5;

// Keep it around just in case we introduce new options in the future.
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ClientOptions { }

export interface SearchOptions {
    /**
    * If provided, it searches only in the assets of the given category.
    * Otherwise, it searches in all categories, unless restricted by
    * `SearchOptions.format`.
    */
    category?: Categories;

    /**
    * Restricts the type of assets to return.
    */
    format?: AssetFormat;

    /**
    * The amount of results to return. Consult the documenation for the current limtis.
    * @link https://docs.nekos.best/api/endpoints.html
    */
    amount?: number;
}

export class Client {
    // TODO: The current ratelimitter assumes single bucket. Split it by multiple paths
    /** @private */
    private _lastRateLimitBody: null | RatelimitBody = null;

    // eslint-disable-next-line @typescript-eslint/no-useless-constructor, @typescript-eslint/no-unused-vars
    constructor(clientOptions?: ClientOptions) { /* */ }

    /** @private */
    private static _parseRatelimitBody(response: Response): null | RatelimitBody {
        const remaining = response.headers.get("x-rate-limit-remaining");
        const resetsAt = response.headers.get("x-rate-limit-reset");

        if (remaining != null && resetsAt != null) {
            return {
                remaining: Number(remaining),
                resetsAt: Date.parse(resetsAt),
            };
        }

        return null;
    }

    /** @private */
    private async _fetch(path: string, _retry = true): Promise<Response> {
        if (this._lastRateLimitBody) {
            const now = Date.now();

            // Rate limit is still valid.
            if (this._lastRateLimitBody.resetsAt > now) {
                if (--this._lastRateLimitBody.remaining < 0) {
                    await sleepAsync(this._lastRateLimitBody.resetsAt - now);
                    this._lastRateLimitBody = null;
                }
            } else {
                // Rate limit has expired.
                this._lastRateLimitBody = null;
            }
        }

        const response = await fetch(`https://nekos.best/api/v2/${path}`, {
            headers: { "User-Agent": "nekos-best.js / 7.0.0" },
            redirect: "follow",
        });

        const ratelimit = Client._parseRatelimitBody(response);

        if (!response.ok) {
            if (response.status === 429) {
                if (_retry) {
                    if (!ratelimit) {
                        throw new Error("Received 429 but not rate limit headers");
                    }

                    await sleepAsync(Date.now() - ratelimit.resetsAt);
                    return this._fetch(path, false);
                }

                throw new Error("Received 429 two times in a row");
            }

            const text = await response.text();

            throw new Error(`Failed to fetch url "${`https://nekos.best/api/v2/${path}`}" (status code ${response.status}): ${text}`);
        }

        if (ratelimit) {
            this._lastRateLimitBody = ratelimit;
        }

        return response;
    }

    /** @private */
    private async _fetchJson<T>(path: string): Promise<T> {
        return await (await this._fetch(path)).json();
    }

    /**
    * Fetches the metadata of multiple GIF assets.
    * @param category The category of assets to fetch from. By default, it picks a random category.
    * @param amount The amount of assets to return. Consult the documentation for the current limits.
    * @returns An array of asset metadata.
    * @link https://docs.nekos.best/api/endpoints.html
    */
    async fetchGifAssets(category?: GifCategories, amount = DEFAULT_AMOUNT): Promise<GifAssetMetadata[]> {
        validatePosInteger(amount);

        if (!category) {
            category = randomIn(CATEGORIES.GIF)[0];
        } else {
            validateAnyIn(category, CATEGORIES.GIF);
        }

        return (await this._fetchJson<EndpointsResponse<GifAssetMetadata>>(`${category}?amount=${amount}`)).results;
    }

    /**
    * Fetches the metadata of multiple PNG assets.
    * @param category The category of assets to fetch from. By default, it picks a random category.
    * @param amount The amount of assets to return. Consult the documentation for the current limits.
    * @returns An array of asset metadata.
    * @link https://docs.nekos.best/api/endpoints.html
    */
    async fetchPngAssets(category?: PngCategories, amount = DEFAULT_AMOUNT): Promise<PngAssetMetadata[]> {
        validatePosInteger(amount);

        if (!category) {
            category = randomIn(CATEGORIES.PNG)[0];
        } else {
            validateAnyIn(category, CATEGORIES.PNG);
        }

        return (await this._fetchJson<EndpointsResponse<PngAssetMetadata>>(`${category}?amount=${amount}`)).results;
    }

    /**
    * Search for assets with the given query. See the documentation of `SearchOptions` for more details.
    *
    * @param query The search query.
    * @param options Searching options.
    * @link https://docs.nekos.best/api/endpoints.html
    */
    async search(query: string, options: SearchOptions = {}): Promise<MixedAssetMetadata[]> {
        if (typeof options.amount !== "undefined") {
            validatePosInteger(options.amount);
        }

        if (typeof options.category !== "undefined") {
            validateAnyIn(options.category, CATEGORIES.GIF, CATEGORIES.PNG);
        }

        const qs = [`query=${encodeURIComponent(query)}`];

        if (options.category) qs.push(`category=${encodeURIComponent(options.category)}`);
        if (options.format) qs.push(`type=${encodeURIComponent(options.format)}`);
        if (options.amount) qs.push(`amount=${encodeURIComponent(options.amount)}`);

        const results = (await this._fetchJson<SearchResponse<MixedAssetMetadata>>(`search?${qs.join("&")}`)).results;

        for (const asset of results) {
            if ("anime_name" in asset) {
                asset.type = "gif";
            } else {
                asset.type = "png";
            }
        }

        return results;
    }
}

/** @package */
interface RatelimitBody {
    remaining: number;
    resetsAt: number;
}
