const centra = require("centra")

const forceRng = (x, min = -Infinity, max = Infinity) => min > max ? 0 : Math.max(Math.min(x, max), min);
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const resolveOutput = (res) => res.json();
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
    constructor() {
        ENDPOINTS.forEach((endpoint) => {
            this[endpoint === 'nekos' ? 'getNeko' : `get${endpoint[0].toUpperCase() + endpoint.slice(1).toLowerCase()}`] = async function (min = 0, max = Infinity) {
                if (min <= 0 && max === Infinity)
                    return await centra(`${BASE_URL}/${endpoint}`).send().then(resolveOutput).then((res) => res ? res.url : null)
                        .catch(() => null);
                
                const limits = await (await centra(`${BASE_URL}/endpoints`).send()).json();
                min = forceRng(min, limits[endpoint].min, limits[endpoint].max);
                max = forceRng(max, limits[endpoint].min, limits[endpoint].max);
                
                return Promise.resolve(`${BASE_URL}/${endpoint}/${String(rand(min, max)).padStart(limits[endpoint].max.length, '0')}${limits[endpoint].format}`);
            }
        })

        this['getRandom'] = async function () {
            const endpoint = ENDPOINTS[Math.floor(Math.random() * ENDPOINTS.length)];
            return await centra(`${BASE_URL}/${endpoint}`).send().then(resolveOutput).then((res) => res ? res.url : null)
                .catch(() => null);
        }
    }
}

module.exports = NekoBestClient
