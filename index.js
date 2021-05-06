const { deprecate } = require(`util`)
const petitio = require("petitio")

const message = `In the next version, this function will not exist anymore! There will be only one function instead of multiple potentially unwanted functions to improve the maintenance of the code.`

const forceRng = (x, min = -Infinity, max = Infinity) => min > max ? 0 : Math.max(Math.min(x, max), min);
const capitalize = (str) => str[ 0 ].toUpperCase() + str.slice(1).toLowerCase();
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
        for (const endpoint of ENDPOINTS) {
            NekoBestClient.prototype[ endpoint === 'nekos' ? 'getNeko' : `get${capitalize(endpoint)}` ] = deprecate(async function (min = 0, max = Infinity, options = {}) {
                if (toString.call(min) === '[object Object]') {
                    options = min;
                    max = options.max || Infinity;
                    min = options.min || 0;
                }

                if (options.amount) options.amount = forceRng(options.amount, 0);

                if (min <= 0 && max === Infinity) {
                    return await petitio(`${BASE_URL}/${endpoint}${options.amount > 1 ? `?amount=${options.amount}` : ''}`).json().then(obj => obj.url).catch(() => null);
                }

                const limits = await petitio(`${BASE_URL}/endpoints`).json().then(res => res[ endpoint ]).catch(() => null);
                if (!limits) return null;

                min = forceRng(min, limits.min, limits.max);
                max = forceRng(max, limits.min, limits.max);

                return `${BASE_URL}/${endpoint}/${String(rand(min, max)).padStart(String(limits.max).length, '0')}${limits.format}`;
            }, message)
        }

        NekoBestClient.prototype[ 'getRandom' ] = async function (options = {}) {
            if (options.amount) options.amount = forceRng(options.amount, 0);
            const endpoint = ENDPOINTS[ Math.floor(Math.random() * ENDPOINTS.length) ];
            return await petitio(`${BASE_URL}/${endpoint}${options.amount > 1 ? `?amount=${options.amount}` : ''}`).json().then(obj => obj.url).catch(() => null);
        }
    }
}

module.exports = NekoBestClient
