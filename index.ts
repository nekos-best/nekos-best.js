import req from 'petitio';

const forceRange = (x: number, min: number, max = Infinity) => min > max ? 0 : Math.max(Math.min(x, max), min)
const BASE_PATH = "https://nekos.best/api/v1";
const ENDPOINTS = [
    'smile', 'smug', 'tickle',
    'kiss', 'laugh', 'nekos',
    'baka', 'cry', 'cuddle',
    'dance', 'feed', 'hug',
    'pat', 'poke', 'slap',
    'wave', 'bite', 'blush',
    'bored', 'facepalm', 'happy',
    'highfive', 'pout', 'shrug',
    'sleep', 'stare', 'think',
    'thumbsup', 'wink'
] as const;

export async function fetchNeko<T extends nbEndpoints>(type: T, amount: number, options?: { min?: number, max?: number }): Promise<nbResponse[] | null>
export async function fetchNeko<T extends nbEndpoints>(type: T, amount?: number, options?: { min?: number, max?: number }): Promise<nbResponse | null>
export async function fetchNeko<T extends nbEndpoints>(type: T, amount?: number, { min = -1, max = -1 } = {}): Promise<unknown> {
    if (typeof amount !== 'undefined' && !Number.isSafeInteger(amount)) throw new ArgumentError(amount, 'amount', 'safe integer')
    if (!ENDPOINTS.includes(type)) throw new ArgumentError(type, 'type', ENDPOINTS.join(', '))
    if (!Number.isSafeInteger(min)) throw new ArgumentError(min, 'min', 'safe integer')
    if (!Number.isSafeInteger(max)) throw new ArgumentError(max, 'max', 'safe integer')
    if (min > max) [min, max] = [max, min]

    if (typeof amount === 'number') return req(`${BASE_PATH}/${type}?amount=${forceRange(amount, 0)}`).json()
        .catch(() => null)

    if (min < 0 && max < 0) return req(`${BASE_PATH}/${type}`).json()
        .catch(() => null)

    const limits = await req(`${BASE_PATH}/endpoints`).json<nbLimits>().then((res) => res[type]).catch(() => null)
    if (!limits) return null

    max = forceRange(max, Number(limits.min), Number(limits.max))
    min = forceRange(min, Number(limits.min), Number(limits.max))

    return { url: `${BASE_PATH}/${type}/${String(min + Math.random() * (max - min) | 0).padStart(limits.max.length, '0')}.${limits.format}` }
}

class ArgumentError extends Error {
    constructor(arg: any, name: string, type: string) { super(`[${name}] Expected ${type}. Received type of ${typeof arg}`) }
}

export type nbLimits = { [k in nbEndpoints]: { min: string, max: string, format: string } }
export type nbEndpoints = typeof ENDPOINTS[number]

export interface nbResponse extends Partial<nbDetails> { url: string }

interface nbDetails {
    artist_href: string
    artist_name: string
    source_url: string
}