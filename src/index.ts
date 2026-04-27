/**
 * API wrapper for the {@link https://nekos.best} API. See {@link Client} to get started.
 *
 * @module .
 */

import {
    ARTWORK_CATEGORIES,
    CATEGORIES,
    ROLEPLAY_CATEGORIES,
} from "./constants.js";

export { Client } from "./client.js";
export * from "./models.js";

/** {@link ARTWORK_CATEGORIES} as a union type. */
export type ArtworkCategory = (typeof ARTWORK_CATEGORIES)[number];

/** {@link ROLEPLAY_CATEGORIES} as a union type. */
export type RoleplayCategory = (typeof ROLEPLAY_CATEGORIES)[number];

/** {@link CATEGORIES} as a union type. */
export type Category = (typeof CATEGORIES)[number];
