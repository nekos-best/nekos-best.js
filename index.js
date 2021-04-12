const petitio = require("petitio")

const forceRng = (x, min = -Infinity, max = Infinity) => min > max ? 0 : Math.max(Math.min(x, max), min);
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const BASE_URL = "https://nekos.best";
const ENDPOINTS = [
    'smile', 'smug', 'tickle',
    'kiss', 'laugh', 'nekos',
    'baka', 'cry', 'cuddle',
    'dance', 'feed', 'hug',
    'pat', 'poke', 'slap',
    'wave'
]

class NekoBestClient {
    constructor () {
        ENDPOINTS.forEach((endpoint) => {
            this[ endpoint === 'nekos' ? 'getNeko' : `get${endpoint[ 0 ].toUpperCase() + endpoint.slice(1).toLowerCase()}` ] = async function (min = 0, max = Infinity) {
                if (min <= 0 && max === Infinity) return await petitio(`${BASE_URL}/${endpoint}`).json().then(({ url }) => url).catch(() => null);

                const limits = await petitio(`${BASE_URL}/endpoints`).json().then(res => res[ endpoint ]).catch(() => null);
                if (!limits) return null;

                min = forceRng(min, limits.min, limits.max);
                max = forceRng(max, limits.min, limits.max);

                return `${BASE_URL}/${endpoint}/${`${rand(min, max)}`.padStart(limits.max.length, '0')}${limits.format}`;
            }
        })

        this[ 'getRandom' ] = async function () {
            const endpoint = ENDPOINTS[ Math.floor(Math.random() * ENDPOINTS.length) ];
            return await petitio(`${BASE_URL}/${endpoint}`).json().then(({ url }) => url).catch(() => null);
        }
    }
}

module.exports = NekoBestClient
