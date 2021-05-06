declare const ENDPOINTS: readonly ["smile", "smug", "tickle", "kiss", "laugh", "nekos", "baka", "cry", "cuddle", "dance", "feed", "hug", "pat", "poke", "slap", "wave"];
export declare function fetchNeko(type: NBEndpoints, opt?: NekosBestOptions): Promise<string[] | string | null>;
export default fetchNeko;
export declare type NBLimits = {
    [k in NBEndpoints]: {
        min: string;
        max: string;
        format: string;
    };
};
export declare type NBEndpoints = typeof ENDPOINTS[number];
export declare type NBResult = {
    url: string;
};
export interface NekosBestOptions {
    amount?: number;
    min?: number;
    max?: number;
}
