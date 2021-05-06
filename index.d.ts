/**
 * Get images or GIFs by https://nekos.best.
 * * Methods return a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).
 * * * You need to [resolve](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/resolve) the URL.
 * * * * You can either use an `async` function and then *`await` the URL* or use the `Promise.then` method.
 * * Visit https://nekos.best/endpoints for a list of all the endpoints.
 */
declare module 'nekos-best.js' {
    export interface NekoBestOptions {
        amount?: number
    }

    export interface ExtendedOptions extends NekoBestOptions {
        max?: number
        min?: number
    }

    type Results = Promise<MaybeArray<string> | null>
    type MaybeArray<T> = T[] | T

    export class NekoBestClient {
        constructor();

        /** Get a waving GIF. Returns `null` if an error occured.
         * Limit the results you can get by adding `min` and `max` arguments
         * @example (async function() { console.log(await client.getWave(5, 10)) })()
         */
        getWave(options: ExtendedOptions): Results
        getWave(min?: number | NekoBestOptions, max?: number, options?: NekoBestOptions): Results

        /** Get a smugging GIF. Returns `null` if an error occured.
         * Limit the results you can get by adding `min` and `max` arguments
         * @example (async function() { console.log(await client.getSmug(5, 10)) })()
         */
        getSmug(options: ExtendedOptions): Results
        getSmug(min?: number | NekoBestOptions, max?: number, options?: NekoBestOptions): Results

        /** Get a smiling GIF. Returns `null` if an error occured.
         * Limit the results you can get by adding `min` and `max` arguments
         * @example (async function() { console.log(await client.getSmile(5, 10)) })()
         */
        getSmile(options: ExtendedOptions): Results
        getSmile(min?: number | NekoBestOptions, max?: number, options?: NekoBestOptions): Results

        /** Get a laughing GIF. Returns `null` if an error occured.
         * Limit the results you can get by adding `min` and `max` arguments
         * @example (async function() { console.log(await client.getLaugh(5, 10)) })()
         */
        getLaugh(options: ExtendedOptions): Results
        getLaugh(min?: number | NekoBestOptions, max?: number, options?: NekoBestOptions): Results

        /** Get a dancing GIF. Returns `null` if an error occured.
         * Limit the results you can get by adding `min` and `max` arguments
         * @example (async function() { console.log(await client.getDance(5, 10)) })()
         */
        getDance(options: ExtendedOptions): Results
        getDance(min?: number | NekoBestOptions, max?: number, options?: NekoBestOptions): Results

        /** Get a crying GIF. Returns `null` if an error occured. 
         * Limit the results you can get by adding `min` and `max` arguments
         * @example (async function() { console.log(await client.getCry(5, 10)) })()
         */
        getCry(options: ExtendedOptions): Results
        getCry(min?: number | NekoBestOptions, max?: number, options?: NekoBestOptions): Results

        /** Get a baka GIF. Returns `null` if an error occured. 
         * Limit the results you can get by adding `min` and `max` arguments
         * @example (async function() { console.log(await client.getBaka(5, 10)) })()
         */
        getBaka(options: ExtendedOptions): Results
        getBaka(min?: number | NekoBestOptions, max?: number, options?: NekoBestOptions): Results

        /** Get a cuddling GIF. Returns `null` if an error occured. 
         * Limit the results you can get by adding `min` and `max` arguments
         * @example (async function() { console.log(await client.getCuddle(10, 23)) })()
         */
        getCuddle(options: ExtendedOptions): Results
        getCuddle(min?: number | NekoBestOptions, max?: number, options?: NekoBestOptions): Results

        /** Get a feeding GIF. Returns `null` if an error occured. 
         * Limit the results you can get by adding `min` and `max` arguments
         * @example (async function() { console.log(await client.getFeed(10, 23)) })()
         */
        getFeed(options: ExtendedOptions): Results
        getFeed(min?: number | NekoBestOptions, max?: number, options?: NekoBestOptions): Results

        /** Get a hugging GIF. Returns `null` if an error occured. 
         * Limit the results you can get by adding `min` and `max` arguments
         * @example (async function() { console.log(await client.getHug(10, 23)) })()
         */
        getHug(options: ExtendedOptions): Results
        getHug(min?: number | NekoBestOptions, max?: number, options?: NekoBestOptions): Results

        /** Get a kissing GIF. Returns `null` if an error occured. 
         * Limit the results you can get by adding `min` and `max` arguments
         * @example (async function() { console.log(await client.getKiss(10, 23)) })()
         */
        getKiss(options: ExtendedOptions): Results
        getKiss(min?: number | NekoBestOptions, max?: number, options?: NekoBestOptions): Results

        /** Get a neko image. Returns `null` if an error occured. 
         * Limit the results you can get by adding `min` and `max` arguments
         * @example (async function() { console.log(await client.getNeko(10, 23)) })()
         */
        getNeko(options: ExtendedOptions): Results
        getNeko(min?: number | NekoBestOptions, max?: number, options?: NekoBestOptions): Results

        /** Get a patting GIF. Returns `null` if an error occured. 
         * Limit the results you can get by adding `min` and `max` arguments
         * @example (async function() { console.log(await client.getPat(10, 23)) })()
         */
        getPat(options: ExtendedOptions): Results
        getPat(min?: number | NekoBestOptions, max?: number, options?: NekoBestOptions): Results

        /** Get a poking GIF. Returns `null` if an error occured. 
         * Limit the results you can get by adding `min` and `max` arguments
         * @example (async function() { console.log(await client.getPoke(10, 23)) })()
         */
        getPoke(options: ExtendedOptions): Results
        getPoke(min?: number | NekoBestOptions, max?: number, options?: NekoBestOptions): Results

        /** Get a slapping GIF. Returns `null` if an error occured. 
         * Limit the results you can get by adding `min` and `max` arguments
         * @example (async function() { console.log(await client.getSlap(10, 23)) })()
         */
        getSlap(options: ExtendedOptions): Results
        getSlap(min?: number | NekoBestOptions, max?: number, options?: NekoBestOptions): Results

        /** Get a tickling GIF. Returns `null` if an error occured. 
         * Limit the results you can get by adding `min` and `max` arguments
         * @example (async function() { console.log(await client.getTickle(10, 23)) })()
         */
        getTickle(options: ExtendedOptions): Results
        getTickle(min?: number | NekoBestOptions, max?: number, options?: NekoBestOptions): Results

        /** Get a random image or GIF. Returns `null` if an error occured. */
        getRandom(options?: NekoBestOptions): Results;
    }

    export default NekoBestClient;
}
