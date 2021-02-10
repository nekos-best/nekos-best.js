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
        /** Get a cuddling GIF. Returns `null` if an error occured. */
        getCuddle(): Promise<string | null>;
        /** Get a feeding GIF. Returns `null` if an error occured. */
        getFeed(): Promise<string | null>;
        /** Get a hugging GIF. Returns `null` if an error occured. */
        getHug(): Promise<string | null>;
        /** Get a kissing GIF. Returns `null` if an error occured. */
        getKiss(): Promise<string | null>;
        /** Get a neko GIF. Returns `null` if an error occured. */
        getNeko(): Promise<string | null>;
        /** Get a patting GIF. Returns `null` if an error occured. */
        getPat(): Promise<string | null>;
        /** Get a poking GIF. Returns `null` if an error occured. */
        getPoke(): Promise<string | null>;
        /** Get a slapping GIF. Returns `null` if an error occured. */
        getSlap(): Promise<string | null>;
        /** Get a tickling GIF. Returns `null` if an error occured. */
        getTickle(): Promise<string | null>;
        /** Get a random image or GIF. Returns `null` if an error occured. */
        getRandom(): Promise<string | null>;
    }
    
    export = NekoBestClient;
}
