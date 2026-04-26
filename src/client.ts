import {
    ARTWORK_CATEGORIES,
    CATEGORIES,
    DEFAULT_FETCH_AMOUNT, DEFAULT_SEARCH_AMOUNT, MAX_FETCH_AMOUNT, MAX_SEARCH_AMOUNT, MAX_SEARCH_QUERY_LEN, MIN_FETCH_AMOUNT, MIN_SEARCH_AMOUNT, MIN_SEARCH_QUERY_LEN,
    ROLEPLAY_CATEGORIES,
} from "./constants.js";
import { ArtworkCategory, Category, RoleplayCategory } from "./index.js";
import { SearchByCategory } from "./models-internal.js";
import {
    ArtworkAsset,
    Asset,
    FetchAssets,
    RoleplayAsset,
    SearchAssets,
} from "./models.js";
import {
    assertInArray,
    assertInRange,
    assertStringLengthInRange,
    pickElement,
    sleepAsync,
} from "./utils.js";

const DIRECT_IMAGE_URL_RE = /^https?:\/{2}nekos\.best\/api\/v\d+\/\w+\/[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}\.\w+/;
const DIRECT_IMAGE_QUOTA_KEY = "direct-file";
const BASE_URL = "https://nekos.best/api/v2";

/**
 * HTTP client for the {@link https://nekos.best} API.
 */
export class Client {
    /** 
     * This map holds pairs of quota keys and a tuple of (remaining requests, reset at timestamp).
     *
     * NOTE: The rate limiter isn't aware of HTTP verbs, i.e., GET and POST requests of the same quota key are considered the same.
     */
    #ratelimitBuckets = new Map<string, [number, number]>();

    /**
    * Fetch random assets.
    *
    * @param category Request assets from a specific category. Set to `null` to select a random category.
    * @param amount The amount of assets to request from the API. Less assets may be returned 
    *   than the specified amount if a category has a small collection. 
    *
    *   It must be between {@link MIN_FETCH_AMOUNT} and {@link MAX_FETCH_AMOUNT}. Defaults to {@link DEFAULT_FETCH_AMOUNT}. 
    * @param abortSignal Optionally cancel this operation. It might still count towards your rate limit.
    * @returns A collection of assets.
    *
    * @see {@link Client#fetchArtworkAssets} to fetch artwork assets with a stronger type.
    * @see {@link Client#fetchRoleplayAssets} to fetch roleplay assets with a stronger type.
    */
    public async fetchAssets(
        category: Category | null,
        amount = DEFAULT_FETCH_AMOUNT,
        abortSignal?: AbortSignal,
    ): Promise<FetchAssets<Asset>> {
        if (category) {
            assertInArray(category, CATEGORIES);
        } else {
            category = pickElement(CATEGORIES);
        }

        return this.#getCategory(category, amount, abortSignal);
    }

    /**
    * Fetch random artwork assets.
    *
    * @param category Request assets from a specific category. Set to `null` to select a random category.
    * @param amount The amount of assets to request from the API. Less assets may be returned 
    *   than the specified amount if a category has a small collection. 
    *
    *   It must be between {@link MIN_FETCH_AMOUNT} and {@link MAX_FETCH_AMOUNT}. Defaults to {@link DEFAULT_FETCH_AMOUNT}.
    * @param abortSignal Optionally cancel this operation. It might still count towards your rate limit.
    * @returns A collection of artwork assets.
    *
    * @see {@link Client#fetchAssets} to fetch assets with a more generic type.
    * @see {@link Client#fetchRoleplayAssets} to fetch roleplay assets instead.
    */
    public async fetchArtworkAssets(
        category: ArtworkCategory | null,
        amount = DEFAULT_FETCH_AMOUNT,
        abortSignal?: AbortSignal,
    ): Promise<FetchAssets<ArtworkAsset>> {
        if (category) {
            assertInArray(category, ARTWORK_CATEGORIES);
        } else {
            category = pickElement(ARTWORK_CATEGORIES);
        }

        return this.#getCategory(category, amount, abortSignal) as Promise<
            FetchAssets<ArtworkAsset>
        >;
    }

    /**
    * Fetch random roleplay assets.
    *
    * @param category Request assets from a specific category. Set to `null` to select a random category.
    * @param amount The amount of assets to request from the API. Less assets may be returned 
    *   than the specified amount if a category has a small collection. 
    *
    *   It must be between {@link MIN_FETCH_AMOUNT} and {@link MAX_FETCH_AMOUNT}. Defaults to {@link DEFAULT_FETCH_AMOUNT}.
    * @param abortSignal Optionally cancel this operation. It might still count towards your rate limit.
    * @returns A collection of roleplay assets.
    *
    * @see {@link Client#fetchAssets} to fetch assets with a more generic type.
    * @see {@link Client#fetchArtworkAssets} to fetch artwork assets instead.
    */
    public async fetchRoleplayAssets(
        category: RoleplayCategory | null,
        amount = DEFAULT_FETCH_AMOUNT,
        abortSignal?: AbortSignal,
    ): Promise<FetchAssets<RoleplayAsset>> {
        if (category) {
            assertInArray(category, ROLEPLAY_CATEGORIES);
        } else {
            category = pickElement(ROLEPLAY_CATEGORIES);
        }


        return this.#getCategory(category, amount, abortSignal) as Promise<
            FetchAssets<RoleplayAsset>
        >;
    }

    /**
    * Search artwork assets.
    *
    * @param query The query to search against the API. It must be between {@link MIN_SEARCH_QUERY_LEN} and {@link MAX_SEARCH_QUERY_LEN} characters.
    * @param category Limit search to assets from a specific category. Set to `null` to search in all artwork categories.
    * @param amount The amount of assets to request from the API. Less assets may be returned 
    *   than the specified amount if a category has a small collection. 
    *
    *   It must be between {@link MIN_SEARCH_AMOUNT} and {@link MAX_SEARCH_AMOUNT}. Defaults to {@link DEFAULT_SEARCH_AMOUNT}.
    * @param abortSignal Optionally cancel this operation. It might still count towards your rate limit.
    * @returns A collection of artwork assets.
    *
    * @see {@link Client#searchRoleplayAssets} to search for roleplay assets instead.
    */
    public async searchArtworkAssets(
        query: string,
        category: ArtworkCategory | null,
        amount = DEFAULT_SEARCH_AMOUNT,
        abortSignal?: AbortSignal,
    ): Promise<SearchAssets<ArtworkAsset>> {
        if (category) {
            assertInArray(category, ARTWORK_CATEGORIES);

            return this.#getSearchByCategory(
                query,
                category,
                amount,
                abortSignal,
            ) as Promise<SearchAssets<ArtworkAsset>>;
        } else {
            return this.#getSearchByKind(
                query,
                SearchByCategory.Artwork,
                amount,
                abortSignal,
            ) as Promise<SearchAssets<ArtworkAsset>>;
        }
    }

    /**
    * Search roleplay assets.
    *
    * @param query The query to search against the API. It must be between {@link MIN_SEARCH_QUERY_LEN} and {@link MAX_SEARCH_QUERY_LEN} characters.
    * @param category Limit search to assets from a specific category. Set to `null` to search in all roleplay categories.
    * @param amount The amount of assets to request from the API. Less assets may be returned 
    *   than the specified amount if a category has a small collection. 
    *
    *   It must be between {@link MIN_SEARCH_AMOUNT} and {@link MAX_SEARCH_AMOUNT}. Defaults to {@link DEFAULT_SEARCH_AMOUNT}.
    * @param abortSignal Optionally cancel this operation. It might still count towards your rate limit.
    * @returns A collection of roleplay assets.
    *
    * @see {@link Client#searchArtworkAssets} to search for artwork assets instead.
    */
    public async searchRoleplayAssets(
        query: string,
        category: RoleplayCategory | null,
        amount = 1,
        abortSignal?: AbortSignal,
    ): Promise<SearchAssets<RoleplayAsset>> {
        if (category) {
            assertInArray(category, ROLEPLAY_CATEGORIES);

            return this.#getSearchByCategory(
                query,
                category,
                amount,
                abortSignal,
            ) as Promise<SearchAssets<RoleplayAsset>>;
        } else {
            return this.#getSearchByKind(
                query,
                SearchByCategory.Roleplay,
                amount,
                abortSignal,
            ) as Promise<SearchAssets<RoleplayAsset>>;
        }
    }

    /**
    * Download an asset's image as a stream.
    *
    * @param url The direct URL to the image.
    * @param abortSignal Optionally cancel this operation. It might still count towards your rate limit.
    *
    * @see {@link Client#downloadAsset} to download the asset directly to a blob.
    * @see {@link Asset#url} to access an asset's image.
    */
    public async downloadStreamAsset(
        url: string,
        abortSignal?: AbortSignal,
    ): Promise<ReadableStream<Uint8Array<ArrayBuffer>>> {
        if (!DIRECT_IMAGE_URL_RE.test(url)) {
            throw new Error(`Invalid asset URL "${url}"`);
        }

        const response = await this.#fetch("GET", url, DIRECT_IMAGE_QUOTA_KEY, abortSignal);

        if (!response.body) {
            throw new Error("Response did not contain body");
        }

        return response.body;
    }

    /**
    * Download an asset's image as a blob.
    *
    * @param url The direct URL to the image.
    * @param abortSignal Optionally cancel this operation. It might still count towards your rate limit.
    *
    * @see {@link Client#downloadStreamAsset} to download the asset as a stream instead.
    * @see {@link Asset#url} to access an asset's image.
    */
    public async downloadAsset(
        url: string,
        abortSignal?: AbortSignal,
    ): Promise<Blob> {
        if (!DIRECT_IMAGE_URL_RE.test(url)) {
            throw new Error(`Invalid asset URL "${url}"`);
        }

        const response = await this.#fetch("GET", url, DIRECT_IMAGE_QUOTA_KEY, abortSignal);

        return await response.blob();
    }

    async #getCategory(
        category: Category,
        amount: number,
        abortSignal?: AbortSignal,
    ): Promise<FetchAssets<Asset>> {
        assertInRange(MIN_FETCH_AMOUNT, amount, MAX_FETCH_AMOUNT);

        const path = `${BASE_URL}/${category}`;
        const url = `${path}?amount=${amount}`;

        return this.#fetchJSON("GET", url, path, abortSignal);
    }

    async #getSearchByCategory(
        query: string,
        category: Category,
        amount: number,
        abortSignal?: AbortSignal,
    ): Promise<SearchAssets<Asset>> {
        assertInRange(MIN_SEARCH_AMOUNT, amount, MAX_SEARCH_AMOUNT);
        assertStringLengthInRange(
            MIN_SEARCH_QUERY_LEN,
            query,
            MAX_SEARCH_QUERY_LEN,
        );

        const path = `${BASE_URL}/search`;
        const url = `${path}?${new URLSearchParams({ amount: amount.toString(), category })}`;

        return this.#fetchJSON("GET", url, path, abortSignal);
    }

    async #getSearchByKind(
        query: string,
        kind: SearchByCategory,
        amount: number,
        abortSignal?: AbortSignal,
    ): Promise<SearchAssets<Asset>> {
        assertInRange(MIN_SEARCH_AMOUNT, amount, MAX_SEARCH_AMOUNT);
        assertStringLengthInRange(
            MIN_SEARCH_QUERY_LEN,
            query,
            MAX_SEARCH_QUERY_LEN,
        );

        const path = `${BASE_URL}/search`;
        const url = `${path}?${new URLSearchParams({ amount: amount.toString(), kind: kind.toString() })}`;

        return this.#fetchJSON("GET", url, path, abortSignal);
    }

    async #fetchJSON<T>(method: string, url: string, quotaKey: string, abortSignal?: AbortSignal): Promise<T> {
        return await (await this.#fetch(method, url, quotaKey, abortSignal)).json();
    }

    async #fetch(method: string, url: string, quotaKey: string, abortSignal?: AbortSignal): Promise<Response> {
        while (true) {
            const rtQuota = this.#ratelimitBuckets.get(quotaKey);
            const now = Date.now();

            if (rtQuota) {
                if (rtQuota[0] <= 0 && rtQuota[1] > now) {
                    // Quota has been exhaused and is still valid.
                    await sleepAsync(rtQuota[1] - now);
                    this.#ratelimitBuckets.delete(quotaKey);
                } else {
                    // Optimistically update remaining quota to rate limit concurrent calls.
                    this.#ratelimitBuckets.set(quotaKey, [rtQuota[0] - 1, rtQuota[1]]);
                }
            }

            const response = await fetch(url, {
                headers: {
                    "User-Agent": `nekos-best.js/7.0.0`,
                },
                redirect: "follow",
                signal: abortSignal,
                method,
            });

            if (response.ok) {
                const remaining = Number(response.headers.get("x-rate-limit-remaining"));
                const resetsAt = Date.parse(response.headers.get("x-rate-limit-reset") || "");

                if (Number.isSafeInteger(remaining) && Number.isSafeInteger(resetsAt)) {
                    this.#ratelimitBuckets.set(quotaKey, [remaining, resetsAt]);
                }

                return response;
            } else if (response.status == 429) {
                const retryAfterSecs = Number(response.headers.get("Retry-After"));

                if (!Number.isSafeInteger(retryAfterSecs)) {
                    throw new Error("You are being rate limited (and the server didn't set Retry-After header)");
                } else {
                    // Our quota info was outdated (or non existent). At least set it now to prevent more 429 responses in other concurrent calls.
                    this.#ratelimitBuckets.set(quotaKey, [0, Date.now() + retryAfterSecs * 1000]);

                    abortSignal?.throwIfAborted();
                    await sleepAsync(retryAfterSecs * 1000);
                    abortSignal?.throwIfAborted();
                }
            } else {
                const body = await response.text();

                throw new Error(`Request "${method} ${url}" failed with status code ${response.status}: ${body}`);
            }
        }
    }
}
