export interface FetchAssets<E extends Asset = Asset> {
    results: E[];
}

/**
 * A generic asset returned by the API.
 *
 * The class isn't very useful on its own. You are expected to use the `is*` type
 * guard methods to access subclass properties or to use the more specialized
 * `<Client>.fetch*Assets` methods.
 */
export class Asset {
    /**
     * @param url The direct URL to the image.
     * @param dimensions The dimensions of the image.
     * @hideconstructor
     */
    constructor(
        public url: string,
        public dimensions: Dimensions,
    ) {}

    /**
     * Ensure this asset is `ArtworkAsset`.
     *
     * This method can be used as a type guard in TypeScript.
     */
    public isArtwork(): this is ArtworkAsset {
        return this instanceof ArtworkAsset;
    }

    /**
     * Ensure this asset is `RoleplayAsset`.
     *
     * This method can be used as a type guard in TypeScript.
     */
    public isRoleplay(): this is RoleplayAsset {
        return this instanceof RoleplayAsset;
    }
}

/**
 * An asset that was created by an artist.
 *
 * The API returns these assets from categories with the "png" format.
 */
export class ArtworkAsset extends Asset {
    /**
     * @param artist The artist that created the image.
     * @param sourceUrl The place where the image was obtained from.
     * @hideconstructor
     */
    constructor(
        url: string,
        dimensions: Dimensions,
        public artist: Artist,
        public sourceUrl: string,
    ) {
        super(url, dimensions);
    }
}

/**
 * An asset that features a clip from an anime.
 *
 * The API returns these assets from categories with the "gif" format.
 */
export class RoleplayAsset extends Asset {
    /**
     * @param anime The anime that this image was taken from.
     * @hideconstructor
     */
    constructor(
        url: string,
        dimensions: Dimensions,
        public anime: Anime,
    ) {
        super(url, dimensions);
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
