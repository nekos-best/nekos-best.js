import {
    ARTWORK_CATEGORIES,
    CATEGORIES,
    ROLEPLAY_CATEGORIES,
} from "./categories.js";

export class Client {
    /** Categories that contain artwork assets. */
    public static artworkCategories = ARTWORK_CATEGORIES;

    /** Categories that contain roleplay assets. */
    public static roleplayCategories = ROLEPLAY_CATEGORIES;

    /** All categories of the API. */
    public static categories = CATEGORIES;
}
