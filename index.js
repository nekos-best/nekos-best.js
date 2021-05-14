"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchNeko = void 0;
const crypto_1 = require("crypto");
const petitio_1 = __importDefault(require("petitio"));
const forceRange = (x, min, max = Infinity) => min > max ? 0 : Math.max(Math.min(x, max), min);
const BASE_PATH = "https://nekos.best";

const ENDPOINTS = [
    'smile', 'smug', 'tickle',
    'kiss', 'laugh', 'nekos',
    'baka', 'cry', 'cuddle',
    'dance', 'feed', 'hug',
    'pat', 'poke', 'slap',
    'wave'
];

async function fetchNeko(type, opt = {}) {
    if (!ENDPOINTS.includes(type))
        throw new Error(`Unknown type ${type}. Available types: ${ENDPOINTS.join(', ')}`);
    if (opt.amount) {
        const results = await petitio_1.default(`${BASE_PATH}/${type}?amount=${forceRange(opt.amount, 0)}`).json().then((res) => res.url).catch(() => null);
        return [].concat(results || []);
    }
    if (!opt.min || opt.min < 0 || !Number.isSafeInteger(opt.max))
        return await petitio_1.default(`${BASE_PATH}/${type}`).json().then((res) => res.url).catch(() => null);
    const limits = await petitio_1.default(`${BASE_PATH}/endpoints`).json().then((res) => res[type]).catch(() => null);
    if (!limits)
        return null;
    opt.max = forceRange(opt.max || 0, Number(limits.min), Number(limits.max));
    opt.min = forceRange(opt.min, Number(limits.min), Number(limits.max));
    return `${BASE_PATH}/${type}/${String(crypto_1.randomInt(opt.min, opt.max)).padStart(limits.max.length, '0')}${limits.format}`;
}
exports.fetchNeko = fetchNeko;
exports.default = fetchNeko;
;
