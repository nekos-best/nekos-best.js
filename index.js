const centra = require("centra")

const resolveOutput = (res) => res.json();
const BASE_URL = "https://nekos.best";
const ENDPOINTS = [
    'cuddle', 'feed',
    'hug', 'kiss',
    'nekos', 'pat',
    'poke', 'slap',
    'tickle'
]

class NekoBestClient {
    constructor() {
        ENDPOINTS.forEach((endpoint) => {
            this[endpoint === 'nekos' ? 'getNeko' : `get${endpoint[0].toUpperCase() + endpoint.slice(1).toLowerCase()}`] = async function () {
                return await centra(`${BASE_URL}/${endpoint}`).send().then(resolveOutput).then((res) => res ? res.url : null)
                    .catch(() => null);
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
