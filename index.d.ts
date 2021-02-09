/**
 * Get images or GIFs by https://nekos.best.
 * * The class methods return a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).
 * * * You need to [resolve](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/resolve) the URL.
 * * * * You can either use an `async` function and then *`await` the URL* or use the `Promise.then` method.
 * * Visit https://nekos.best/endpoints for a list of all the endpoints.
 */
export default class NekoBestClient {
    getCuddle(): Promise<string | null>
    getFeed(): Promise<string | null>
    getHug(): Promise<string | null>
    getKiss(): Promise<string | null>
    getNekos(): Promise<string | null>
    getPat(): Promise<string | null>
    getPoke(): Promise<string | null>
    getSlap(): Promise<string | null>
    getTickle(): Promise<string | null>
}