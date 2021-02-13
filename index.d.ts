/**
 * Get images or GIFs by https://nekos.best.
 * * The class methods return a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).
 * * * You need to [resolve](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/resolve) the URL.
 * * * * You can either use an `async` function and then *`await` the URL* or use the `Promise.then` method.
 * * Visit https://nekos.best/endpoints for a list of all the endpoints.
 */
declare module 'nekos-best.js' {
    class NekoBestClient {
        constructor();

        /** Get a waving GIF. Returns `null` if an error occured.
         * Limit the results you can get by adding `min` and `max` arguments
         * @example (async function() { console.log(await client.getWave(5, 10)) })()
         */
        getWave(min?: number, max?: number): Promise<string | null>;

        /** Get a smugging GIF. Returns `null` if an error occured.
         * Limit the results you can get by adding `min` and `max` arguments
         * @example (async function() { console.log(await client.getSmug(5, 10)) })()
         */
        getSmug(min?: number, max?: number): Promise<string | null>;

        /** Get a smiling GIF. Returns `null` if an error occured.
         * Limit the results you can get by adding `min` and `max` arguments
         * @example (async function() { console.log(await client.getSmile(5, 10)) })()
         */
        getSmile(min?: number, max?: number): Promise<string | null>;

        /** Get a laughing GIF. Returns `null` if an error occured.
         * Limit the results you can get by adding `min` and `max` arguments
         * @example (async function() { console.log(await client.getLaugh(5, 10)) })()
         */
        getLaugh(min?: number, max?: number): Promise<string | null>;

        /** Get a dancing GIF. Returns `null` if an error occured.
         * Limit the results you can get by adding `min` and `max` arguments
         * @example (async function() { console.log(await client.getDance(5, 10)) })()
         */
        getDance(min?: number, max?: number): Promise<string | null>;

        /** Get a crying GIF. Returns `null` if an error occured. 
         * Limit the results you can get by adding `min` and `max` arguments
         * @example (async function() { console.log(await client.getCry(5, 10)) })()
         */
        getCry(min?: number, max?: number): Promise<string | null>;

        /** Get a baka GIF. Returns `null` if an error occured. 
         * Limit the results you can get by adding `min` and `max` arguments
         * @example (async function() { console.log(await client.getBaka(5, 10)) })()
         */
        getBaka(min?: number, max?: number): Promise<string | null>;

        /** Get a cuddling GIF. Returns `null` if an error occured. 
         * Limit the results you can get by adding `min` and `max` arguments
         * @example (async function() { console.log(await client.getCuddle(10, 23)) })()
         */
        getCuddle(min?: number, max?: number): Promise<string | null>;

        /** Get a feeding GIF. Returns `null` if an error occured. 
         * Limit the results you can get by adding `min` and `max` arguments
         * @example (async function() { console.log(await client.getFeed(10, 23)) })()
         */
        getFeed(min?: number, max?: number): Promise<string | null>;

        /** Get a hugging GIF. Returns `null` if an error occured. 
         * Limit the results you can get by adding `min` and `max` arguments
         * @example (async function() { console.log(await client.getHug(10, 23)) })()
         */
        getHug(min?: number, max?: number): Promise<string | null>;

        /** Get a kissing GIF. Returns `null` if an error occured. 
         * Limit the results you can get by adding `min` and `max` arguments
         * @example (async function() { console.log(await client.getKiss(10, 23)) })()
         */
        getKiss(min?: number, max?: number): Promise<string | null>;

        /** Get a neko GIF. Returns `null` if an error occured. 
         * Limit the results you can get by adding `min` and `max` arguments
         * @example (async function() { console.log(await client.getNeko(10, 23)) })()
         */
        getNeko(min?: number, max?: number): Promise<string | null>;

        /** Get a patting GIF. Returns `null` if an error occured. 
         * Limit the results you can get by adding `min` and `max` arguments
         * @example (async function() { console.log(await client.getPat(10, 23)) })()
         */
        getPat(min?: number, max?: number): Promise<string | null>;

        /** Get a poking GIF. Returns `null` if an error occured. 
         * Limit the results you can get by adding `min` and `max` arguments
         * @example (async function() { console.log(await client.getPoke(10, 23)) })()
         */
        getPoke(min?: number, max?: number): Promise<string | null>;

        /** Get a slapping GIF. Returns `null` if an error occured. 
         * Limit the results you can get by adding `min` and `max` arguments
         * @example (async function() { console.log(await client.getSlap(10, 23)) })()
         */
        getSlap(min?: number, max?: number): Promise<string | null>;

        /** Get a tickling GIF. Returns `null` if an error occured. 
         * Limit the results you can get by adding `min` and `max` arguments
         * @example (async function() { console.log(await client.getTickle(10, 23)) })()
         */
        getTickle(min?: number, max?: number): Promise<string | null>;

        /** Get a random image or GIF. Returns `null` if an error occured. */
        getRandom(): Promise<string | null>;
    }
    
    export = NekoBestClient;
}
