/**
 * Response type of {@link Client#fetchAssets}, {@link Client#fetchArtworkAssets}, and {@link Client#fetchRoleplayAssets}.
 */
export interface FetchAssets<E extends Asset = Asset> {
    results: E[];
}

/**
 * Response type of {@link Client#searchArtworkAssets}, and {@link Client#searchRoleplayAssets}.
 */
export interface SearchAssets<E extends Asset = Asset> {
    results: E[];
}

/**
 * A generic asset.
 */
export class Asset {
    /**
     * The direct URL to the asset's image.
     *
     * @see {@link Client#downloadAsset} to download the image itself.
     */
    public url: string;

    /*
     * The dimensions of the asset's image.
     */
    public dimensions: Dimensions;

    /** @hideconstructor */
    constructor(url: string, dimensions: Dimensions) {
        this.dimensions = dimensions;
        this.url = url;
    }

    /**
     * Assert `this` is {@link ArtworkAsset}.
     */
    public isArtwork(): this is ArtworkAsset {
        return this instanceof ArtworkAsset;
    }

    /**
     * Assert `this` is {@link RoleplayAsset}.
     */
    public isRoleplay(): this is RoleplayAsset {
        return this instanceof RoleplayAsset;
    }
}

/**
 * An artwork asset. It features content that was created by a human artist.
 *
 * The API returns these assets from categories with the "png" format.
 */
export class ArtworkAsset extends Asset {
    /** The artist that created the asset's image */
    public artist: Artist;

    /** The place where the image was obtained from. */
    public sourceUrl: string;

    /** @hideconstructor */
    constructor(
        url: string,
        dimensions: Dimensions,
        artist: Artist,
        sourceUrl: string,
    ) {
        super(url, dimensions);

        this.artist = artist;
        this.sourceUrl = sourceUrl;
    }
}

/**
 * A roleplay asset. It features a clip from an anime.
 *
 * The API returns these assets from categories with the "gif" format.
 */
export class RoleplayAsset extends Asset {
    /** The anime where this image was taken from. */
    public anime: Anime;

    /** @hideconstructor */
    constructor(url: string, dimensions: Dimensions, anime: Anime) {
        super(url, dimensions);

        this.anime = anime;
    }
}

export interface Artist {
    /** The name of the artist. */
    name: string;
    /** The profile URL of the artist. */
    profileUrl: string;
}

export interface Anime {
    /** The name of the anime. */
    name: string;
}

/** Dimensions of an asset's image. */
export interface Dimensions {
    /** The width of an image in pixels. */
    width: number;
    /** The height of an image in pixels. */
    height: number;
}
