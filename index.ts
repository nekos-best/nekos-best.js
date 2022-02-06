import req from 'petitio';

const forceRange = (x: number, min: number, max = Infinity) => min > max ? 0 : Math.max(Math.min(x, max), min)
const BASE_PATH = "https://nekos.best/api/v1";
const ENDPOINTS = [
    'baka', 'bite', 'blush',
    'bored', 'cry', 'cuddle',
    'dance', 'facepalm', 'feed',
    'happy', 'highfive', 'hug',
    'kiss', 'laugh', 'nekos',
    'pat', 'poke', 'pout',
    'shrug', 'slap', 'sleep',
    'smile', 'smug', 'stare',
    'think', 'thumbsup', 'tickle',
    'wave', 'wink'
] as const;

export async function fetchNeko<T extends nbEndpoints>(type: T, amount: number, options?: { min?: number, max?: number }): Promise<nbResponse[] | null>
export async function fetchNeko<T extends nbEndpoints>(type: T, amount?: number, options?: { min?: number, max?: number }): Promise<nbResponse | null>
export async function fetchNeko<T extends nbEndpoints>(type: T, amount?: number, { min = -1, max = -1 } = {}): Promise<unknown> {
    if (!ENDPOINTS.includes(type)) throw new TypeError(`Unknown category for 'type'. Received '${type}'. Available endpoints: ${ENDPOINTS.join(', ')}`)
    if (typeof amount !== 'undefined' && !Number.isSafeInteger(amount)) throw new TypeError(`Expected a safe integer for 'amount'. Received ${typeof amount}`)
    if (!Number.isSafeInteger(min)) throw new TypeError(`Expected a safe integer for 'min'. Received ${typeof min}`)
    if (!Number.isSafeInteger(max)) throw new TypeError(`Expected a safe integer for 'max'. Received ${typeof max}`)

    if (min > max) [min, max] = [max, min]

    if (typeof amount === 'number') return req(`${BASE_PATH}/${type}?amount=${forceRange(amount, 0)}`).json()
        .catch(() => null)

    if (min < 0 && max < 0) return req(`${BASE_PATH}/${type}`).json()
        .catch(() => null)

    const limits = await req(`${BASE_PATH}/endpoints`).json<nbLimits>().then((res) => res[type]).catch(() => null)
    if (!limits) return null

    max = forceRange(max, Number(limits.min), Number(limits.max))
    min = forceRange(min, Number(limits.min), Number(limits.max))

    return { url: `${BASE_PATH}/${type}/${String(min + Math.floor(Math.random() * (max - min))).padStart(limits.max.length, '0')}.${limits.format}` }
}

export type nbLimits = { [k in nbEndpoints]: { min: string, max: string, format: string } }
export type nbEndpoints = typeof ENDPOINTS[number]

export interface nbResponse {
    url: string

    artist_href?: string
    artist_name?: string
    source_url?: string
    anime_name?: string
}