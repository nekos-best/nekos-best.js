/**
* Selects an element in one of the provided arrays. Returns the element and the array chosen.
* @package
*/
export function randomIn<T>(...arrays: readonly (readonly T[])[]): [T, readonly T[]] {
    const arr = arrays[Math.floor(Math.random() * arrays.length)];
    const element = arr[Math.floor(Math.random() * arr.length)];

    return [element, arr];
}

/** @package */
export async function sleepAsync(ms: number) {
    if (ms > 0) {
        await new Promise(resolve => {
            setTimeout(resolve, ms);
        });
    }
}

/** @package */
export function validateAnyIn<T>(searchElement: T, ...arrays: readonly (readonly T[])[]) {
    if (!arrays.some(arr => arr.includes(searchElement))) {
        throw new Error(`"${searchElement}" isn't in ${arrays.map(arr => arr.join(", ")).join(", ")}`);
    }
}

/** @package */
export function validatePosInteger(number: number) {
    if (!Number.isSafeInteger(number)) {
        throw new Error(`Expected a safe integer. Got ${number}`);
    }

    if (number <= 0) {
        throw new Error(`Expected a positive integers. Got ${number}`);
    }
}
