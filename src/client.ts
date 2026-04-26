import {
    ARTWORK_CATEGORIES,
    CATEGORIES,
    ROLEPLAY_CATEGORIES,
} from "./constants.js";
import { DEFAULT_FETCH_AMOUNT, DEFAULT_SEARCH_AMOUNT, MAX_FETCH_AMOUNT, MAX_SEARCH_AMOUNT, MAX_SEARCH_QUERY_LEN, MIN_FETCH_AMOUNT, MIN_SEARCH_AMOUNT, MIN_SEARCH_QUERY_LEN } from "./constants.js";
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
} from "./utils.js";


/**
 * HTTP client for the {@link https://nekos.best} API.
 */
export class Client {
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
    * @see {@link Client#fetchArtworkAssets} To fetch artwork assets with a stronger type.
    * @see {@link Client#fetchRoleplayAssets} To fetch roleplay assets with a stronger type.
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

        return this.#fetchAssets(category, amount, abortSignal);
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
    * @see {@link Client#fetchAssets} To fetch assets with a more generic type.
    * @see {@link Client#fetchRoleplayAssets} To fetch roleplay assets instead.
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

        return this.#fetchAssets(category, amount, abortSignal) as Promise<
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
    * @see {@link Client#fetchAssets} To fetch assets with a more generic type.
    * @see {@link Client#fetchArtworkAssets} To fetch artwork assets instead.
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


        return this.#fetchAssets(category, amount, abortSignal) as Promise<
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
    * @see {@link Client#searchRoleplayAssets} To search for roleplay assets instead.
    */
    public async searchArtworkAssets(
        query: string,
        category: ArtworkCategory | null,
        amount = DEFAULT_SEARCH_AMOUNT,
        abortSignal?: AbortSignal,
    ): Promise<SearchAssets<ArtworkAsset>> {
        if (category) {
            assertInArray(category, ARTWORK_CATEGORIES);

            return this.#searchAssetsByCategory(
                query,
                category,
                amount,
                abortSignal,
            ) as Promise<SearchAssets<ArtworkAsset>>;
        } else {
            return this.#searchAssetsByCategories(
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
    * @see {@link Client#searchArtworkAssets} To search for artwork assets instead.
    */
    public async searchRoleplayAssets(
        query: string,
        category: RoleplayCategory | null,
        amount = 1,
        abortSignal?: AbortSignal,
    ): Promise<SearchAssets<RoleplayAsset>> {
        if (category) {
            assertInArray(category, ROLEPLAY_CATEGORIES);

            return this.#searchAssetsByCategory(
                query,
                category,
                amount,
                abortSignal,
            ) as Promise<SearchAssets<RoleplayAsset>>;
        } else {
            return this.#searchAssetsByCategories(
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
    * @see {@link Client#downloadAsset} To download the asset directly to a blob.
    * @see {@link Asset#url} To access an asset's image.
    */
    public async downloadStreamAsset(
        url: string,
        abortSignal?: AbortSignal,
    ): Promise<ReadableStream<Uint8Array<ArrayBuffer>>> {
        throw 1;
    }

    /**
    * Download an asset's image as a blob.
    *
    * @param url The direct URL to the image.
    * @param abortSignal Optionally cancel this operation. It might still count towards your rate limit.
    *
    * @see {@link Client#downloadStreamAsset} To download the asset as a stream instead.
    * @see {@link Asset#url} To access an asset's image.
    */
    public async downloadAsset(
        url: string,
        abortSignal?: AbortSignal,
    ): Promise<Blob> {
        throw 1;
    }

    async #fetchAssets(
        category: Category,
        amount: number,
        abortSignal?: AbortSignal,
    ): Promise<FetchAssets<Asset>> {
        assertInRange(MIN_FETCH_AMOUNT, amount, MAX_FETCH_AMOUNT);

        throw 1;
    }

    async #searchAssetsByCategory(
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

        throw 1;
    }

    async #searchAssetsByCategories(
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

        throw 1;
    }
}
