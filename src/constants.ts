/**
 * Constants of the library. They are placed in a separate entrypoint to not clutter the main library imports.
 *
 * @module constants.js
 */

/** 
 * The minimum amount that can be specified in {@link .!Client#fetchAssets}, {@link .!Client#fetchArtworkAssets}, and {@link .!Client#fetchRoleplayAssets}.
 */
export const MIN_FETCH_AMOUNT = 1;

/** 
 * The maximum amount that can be specified in {@link .!Client#fetchAssets}, {@link .!Client#fetchArtworkAssets}, and {@link .!Client#fetchRoleplayAssets}.
 */
export const MAX_FETCH_AMOUNT = 20;

/** 
 * The default amount in {@link .!Client#fetchAssets}, {@link .!Client#fetchArtworkAssets}, and {@link .!Client#fetchRoleplayAssets}.
 */
export const DEFAULT_FETCH_AMOUNT = 1;

/** 
 * The minimum amount that can be specified in {@link .!Client#searchArtworkAssets}, and {@link .!Client#searchRoleplayAssets}.
 */
export const MIN_SEARCH_AMOUNT = 1;

/** 
 * The maximum amount that can be specified in {@link .!Client#searchArtworkAssets}, and {@link .!Client#searchRoleplayAssets}.
 */
export const MAX_SEARCH_AMOUNT = 25;

/** 
 * The default amount in {@link .!Client#searchArtworkAssets}, and {@link .!Client#searchRoleplayAssets}.
 */
export const DEFAULT_SEARCH_AMOUNT = 5;

/** 
 * The minimum length of the search query in {@link .!Client#searchArtworkAssets}, and {@link .!Client#searchRoleplayAssets}.
 */
export const MIN_SEARCH_QUERY_LEN = 3;

/** 
 * The maximum length of the search query in {@link .!Client#searchArtworkAssets}, and {@link .!Client#searchRoleplayAssets}.
 */
export const MAX_SEARCH_QUERY_LEN = 150;

/** Categories that contain artwork assets. */
export const ARTWORK_CATEGORIES = Object.freeze([
    "kitsune",
    "neko",
    "husbando",
    "waifu",
] as const);

/** Categories that contain roleplay assets. */
export const ROLEPLAY_CATEGORIES = Object.freeze([
    "angry",
    "baka",
    "bite",
    "bleh",
    "blowkiss",
    "blush",
    "bonk",
    "bored",
    "carry",
    "clap",
    "confused",
    "cry",
    "cuddle",
    "dance",
    "facepalm",
    "feed",
    "handhold",
    "handshake",
    "happy",
    "highfive",
    "hug",
    "kabedon",
    "kick",
    "kiss",
    "lappillow",
    "laugh",
    "lurk",
    "nod",
    "nom",
    "nope",
    "nya",
    "pat",
    "peck",
    "poke",
    "pout",
    "punch",
    "run",
    "salute",
    "shake",
    "shocked",
    "shoot",
    "shrug",
    "sip",
    "slap",
    "sleep",
    "smile",
    "smug",
    "spin",
    "stare",
    "tableflip",
    "teehee",
    "think",
    "thumbsup",
    "tickle",
    "wag",
    "wave",
    "wink",
    "yawn",
    "yeet",
] as const);

/** All available categories. */
export const CATEGORIES = Object.freeze([
    ...ARTWORK_CATEGORIES,
    ...ROLEPLAY_CATEGORIES,
]);
