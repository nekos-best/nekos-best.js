import type { CATEGORIES } from "./constants.js";

export type Categories = GifCategories | PngCategories;

export interface CommonAssetMetadata {
    /** The link to download the given asset. */
    url: string;
}

export interface GifAssetMetadata extends CommonAssetMetadata {
    /** The name of the featured anime. */
    anime_name: string;
}

export type GifCategories = typeof CATEGORIES["GIF"][number];

export interface PngAssetMetadata extends CommonAssetMetadata {
    /** The link to the artist's page. */
    artist_href: string;
    /** The name of the artist. */
    artist_name: string;
    /** The link where the asset was obtained from. */
    source_url: string;
}

export type PngCategories = typeof CATEGORIES["PNG"][number];

export type AssetFormat = "png" | "gif";

export type MixedAssetMetadata =
    | (GifAssetMetadata & { type: "gif" })
    | (PngAssetMetadata & { type: "png" });

/** @private */
export interface EndpointsResponse<T> {
    results: T[];
}


/** @private */
export interface SearchResponse<T> {
    results: T[];
}
