import req from 'petitio';

const forceRange = (x: number, min: number, max = Infinity) => min > max ? 0 : Math.max(Math.min(x, max), min)
const BASE_PATH = "https://nekos.best";
const ENDPOINTS = [
    'smile', 'smug', 'tickle',
    'kiss', 'laugh', 'nekos',
    'baka', 'cry', 'cuddle',
    'dance', 'feed', 'hug',
    'pat', 'poke', 'slap',
    'wave'
] as const;

const defaultProperties = {
    artist_href: void 0,
    artist_name: void 0,
    source_url: void 0
}

export async function fetchNeko<T extends nbEndpoints>(type: T, amount: number, options?: { min?: number, max?: number }): Promise<GetResType<T>[] | null>
export async function fetchNeko<T extends nbEndpoints>(type: T, amount?: number, options?: { min?: number, max?: number }): Promise<GetResType<T> | null>
export async function fetchNeko<T extends nbEndpoints>(type: T, amount?: number, { min = -1, max = -1 } = {}): Promise<unknown> {
    if (!ENDPOINTS.includes(type)) throw new Error(`Unknown type ${type}. Available types: ${ENDPOINTS.join(', ')}`);
    if (typeof amount !== 'undefined' && typeof amount !== 'number') throw new Error(`Amount has to be a number. Received typeof ${typeof amount}`)
    if (min > max) [min, max] = [max, min]

    if (typeof amount === 'number') {
        const response = await req(`${BASE_PATH}/${type}?amount=${forceRange(amount, 0)}`).json<nbResponse<true>>()
            .then(merge).catch(() => null)
        if (!response) return null
        return Array(0).concat(response)
    }

    if (min < 0 && max < 0) return await req(`${BASE_PATH}/${type}`).json<nbResponse>()
        .then(merge).catch(() => null)

    const limits = await req(`${BASE_PATH}/endpoints`).json<nbLimits>().then((res) => res[type]).catch(() => null)
    if (!limits) return null

    max = forceRange(max || 0, Number(limits.min), Number(limits.max))
    min = forceRange(min, Number(limits.min), Number(limits.max))

    return { url: `${BASE_PATH}/${type}/${String((Math.random() * max) + min | 0).padStart(limits.max.length, '0')}${limits.format}` }
}

function merge(response: nbResponse | nbResponse<true>): nbResult | nbResult[] {
    if (Array.isArray(response.url)) {
        const details = response.details as nbResponse<true>['details']
        return response.url.map((url, i) => decode(Object.assign({ url }, details.length ? details[i] || defaultProperties : defaultProperties)))
    } else return decode(Object.assign({ url: response.url }, response.details || defaultProperties))
}

function decode<T extends object>(obj: T): T {
    for (const [k, v] of Object.entries(obj)) obj[k as keyof T] = (v ? decodeURIComponent(v) : void 0) as never
    return obj
}

export default fetchNeko;

export type nbEndpoints = typeof ENDPOINTS[number]
export type nbLimits = { [k in nbEndpoints]: { min: string, max: string, format: string } }
type GetResType<T extends nbEndpoints> = T extends 'nekos'
    ? Required<nbResult>
    : nbResult

export interface nbResult extends Partial<nbDetails> { url: string }

interface nbResponse<A extends boolean = false> {
    details: A extends true ? nbDetails[] : nbDetails | null
    url: A extends true ? string[] : string
}

interface nbDetails {
    artist_href: string
    artist_name: string
    source_url: string
}