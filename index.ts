import { randomInt } from 'crypto';
import req from 'petitio';

const forceRange = (x: number, min: number, max = Infinity) => min > max ? 0 : Math.max(Math.min(x, max), min);

const BASE_PATH = "https://nekos.best";
const ENDPOINTS = [
    'smile', 'smug', 'tickle',
    'kiss', 'laugh', 'nekos',
    'baka', 'cry', 'cuddle',
    'dance', 'feed', 'hug',
    'pat', 'poke', 'slap',
    'wave'
] as const;

export async function fetchNeko(type: NBEndpoints, opt: NekosBestOptions = {}): Promise<string[] | string | null> {
    if (!ENDPOINTS.includes(type)) throw new Error(`Unknown type ${type}. Available types: ${ENDPOINTS.join(', ')}`);
    if (opt.amount) {
        const results = await req(`${BASE_PATH}/${type}?amount=${forceRange(opt.amount, 0)}`).json().then((res) => res.url).catch(() => null);
        return [].concat(results || []);
    } if (!opt.min || opt.min < 0 || !Number.isSafeInteger(opt.max)) return await req(`${BASE_PATH}/${type}`).json<NBResult>().then((res) => res.url).catch(() => null);

    const limits = await req(`${BASE_PATH}/endpoints`).json<NBLimits>().then((res) => res[type]).catch(() => null)
    if (!limits) return null

    opt.max = forceRange(opt.max || 0, Number(limits.min), Number(limits.max))
    opt.min = forceRange(opt.min, Number(limits.min), Number(limits.max))

    return `${BASE_PATH}/${type}/${String(randomInt(opt.min, opt.max)).padStart(limits.max.length, '0')}${limits.format}`
}

export default fetchNeko;
export type NBLimits = { [k in NBEndpoints]: { min: string, max: string, format: string } };
export type NBEndpoints = typeof ENDPOINTS[number];
export type NBResult = { url: string };
export interface NekosBestOptions {
    amount?: number
    min?: number
    max?: number
};