import type { GifAssetMetadata, GifCategories, PngAssetMetadata, PngCategories } from "./types.js";
import type { Optional } from "utils";

import { randomIn, sleepAsync, validateAnyIn, validatePosInteger } from "./utils.js";
import { CATEGORIES } from "./constants.js";

export type * from "./types.js";

// Keep it around just in case we introduce new options in the future.
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ClientOptions { }

/** @package */
interface RatelimitBody {
    remaining: number;
    resetsAt: number;
}

export class Client {
    // TODO: The current ratelimitter assumes single bucket. Split it by multiple paths
    /** @private */
    _lastRateLimitBody: null | RatelimitBody = null;

    // eslint-disable-next-line @typescript-eslint/no-useless-constructor, @typescript-eslint/no-unused-vars
    constructor(clientOptions?: ClientOptions) { /* */ }

    /** @private */
    static _parseRatelimitBody(response: Response): null | RatelimitBody {
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
    async _fetch(path: string, _retry = true): Promise<Response> {
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
    async _fetchJson<T>(path: string): Promise<T> {
        return await (await this._fetch(path)).json();
    }

    async fetchGifAssets(category?: Optional<GifCategories>, amount = 5): Promise<GifAssetMetadata[]> {
        validatePosInteger(amount);

        if (!category) {
            category = randomIn(CATEGORIES.GIF)[0];
        } else {
            validateAnyIn(category, CATEGORIES.GIF);
        }

        return await this._fetchJson(`endpoints/${category}?amount=${amount}`);
    }

    async fetchPngAssets(category?: Optional<PngCategories>, amount = 5): Promise<PngAssetMetadata[]> {
        validatePosInteger(amount);

        if (!category) {
            category = randomIn(CATEGORIES.PNG)[0];
        } else {
            validateAnyIn(category, CATEGORIES.PNG);
        }

        return await this._fetchJson(`endpoints/${category}?amount=${amount}`);
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
    // async search(
    //     query: string,
    //     category: Optional<NbCategories> = null,
    //     amount = 1,
    // ): Promise<NbResponse> {
    //     if (this._lastRateLimitBody != null) {
    //         await handleRatelimit(
    //             this.#clientOptions.ratelimitHandleMode,
    //             this._lastRateLimitBody,
    //         );
    //     }

    //     if (!category) {
    //         category = pickRandomCategory();
    //     } else {
    //         validateCategory(category);
    //     }

    //     if (!Number.isSafeInteger(amount)) {
    //         throw new TypeError(
    //             `Expected a safe integer for amount. Got "${amount}".`,
    //         );
    //     }

    //     // Type 1 is images so if `category` is in `IMAGE_CATEGORIES`, the result will be 2 - 1 = 1
    //     // Type 2 is for GIFs; 2 - 0 = 2
    //     const type = 2 - +IMAGE_CATEGORIES.includes(category as never);
    //     const response = await fetchPath(
    //         `search?query=${encodeURIComponent(query)}&type=${type}&category=${category}&amount=${amount}`,
    //     );

    //     const remaining = response.headers.get("x-rate-limit-remaining");
    //     const resetsIn = response.headers.get("x-rate-limit-reset");

    //     if (remaining != null && resetsIn != null) {
    //         this._lastRateLimitBody = {
    //             resetsAt: Date.parse(resetsIn),
    //             remaining: Number(remaining),
    //         };
    //     }

    //     return (await response.json()) as NbResponse;
    // }
}
