import {
    ARTWORK_CATEGORIES,
    Category,
    CATEGORIES,
    ROLEPLAY_CATEGORIES,
    ArtworkCategory,
    RoleplayCategory,
} from "./categories.js";
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

const MIN_FETCH_AMOUNT = 1;
const MAX_FETCH_AMOUNT = 20;

const MIN_SEARCH_AMOUNT = 1;
const MAX_SEARCH_AMOUNT = 25;

const MIN_SEARCH_QUERY_LEN = 3;
const MAX_SEARCH_QUERY_LEN = 150;

export class Client {
    /** Categories that contain artwork assets. */
    public static artworkCategories = ARTWORK_CATEGORIES;

    /** Categories that contain roleplay assets. */
    public static roleplayCategories = ROLEPLAY_CATEGORIES;

    /** All categories of the API. */
    public static categories = CATEGORIES;

    public async fetchAssets(
        category: Category | null,
        amount = 1,
        abortSignal?: AbortSignal,
    ): Promise<FetchAssets<Asset>> {
        if (category) {
            assertInArray(category, CATEGORIES);
        } else {
            category = pickElement(CATEGORIES);
        }

        assertInRange(MIN_FETCH_AMOUNT, amount, MAX_FETCH_AMOUNT);

        return this.#fetchAssets(category, amount, abortSignal);
    }

    public async fetchArtworkAssets(
        category: ArtworkCategory | null,
        amount = 1,
        abortSignal?: AbortSignal,
    ): Promise<FetchAssets<ArtworkAsset>> {
        if (category) {
            assertInArray(category, ARTWORK_CATEGORIES);
        } else {
            category = pickElement(ARTWORK_CATEGORIES);
        }

        assertInRange(MIN_FETCH_AMOUNT, amount, MAX_FETCH_AMOUNT);

        return this.#fetchAssets(category, amount, abortSignal) as Promise<
            FetchAssets<ArtworkAsset>
        >;
    }

    public async fetchRoleplayAssets(
        category: RoleplayCategory | null,
        amount = 1,
        abortSignal?: AbortSignal,
    ): Promise<FetchAssets<RoleplayAsset>> {
        if (category) {
            assertInArray(category, ROLEPLAY_CATEGORIES);
        } else {
            category = pickElement(ROLEPLAY_CATEGORIES);
        }

        assertInRange(MIN_FETCH_AMOUNT, amount, MAX_FETCH_AMOUNT);

        return this.#fetchAssets(category, amount, abortSignal) as Promise<
            FetchAssets<RoleplayAsset>
        >;
    }

    public async searchArtworkAssets(
        query: string,
        category: ArtworkCategory | null,
        amount = 1,
        abortSignal?: AbortSignal,
    ): Promise<SearchAssets<ArtworkAsset>> {
        assertInRange(MIN_SEARCH_AMOUNT, amount, MAX_SEARCH_AMOUNT);
        assertStringLengthInRange(
            MIN_SEARCH_QUERY_LEN,
            query,
            MAX_SEARCH_QUERY_LEN,
        );

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

    public async searchRoleplayAssets(
        query: string,
        category: RoleplayCategory | null,
        amount = 1,
        abortSignal?: AbortSignal,
    ): Promise<SearchAssets<RoleplayAsset>> {
        assertInRange(MIN_SEARCH_AMOUNT, amount, MAX_SEARCH_AMOUNT);
        assertStringLengthInRange(
            MIN_SEARCH_QUERY_LEN,
            query,
            MAX_SEARCH_QUERY_LEN,
        );

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

    public async downloadStreamAsset(
        url: string,
        abortSignal?: AbortSignal,
    ): Promise<ReadableStream<Uint8Array<ArrayBuffer>>> {
        throw 1;
    }

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
        throw 1;
    }

    async #searchAssetsByCategory(
        query: string,
        category: Category,
        amount: number,
        abortSignal?: AbortSignal,
    ): Promise<SearchAssets<Asset>> {
        throw 1;
    }

    async #searchAssetsByCategories(
        query: string,
        kind: SearchByCategory,
        amount: number,
        abortSignal?: AbortSignal,
    ): Promise<SearchAssets<Asset>> {
        throw 1;
    }
}
