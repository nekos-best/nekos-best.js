export function pickElement<T>(array: readonly T[]): T {
    return array[Math.floor(array.length * Math.random())];
}

export function assertInArray<T>(element: T, array: readonly T[]) {
    if (!array.includes(element)) {
        throw new Error(
            `Expected "${element}" to be one of "${array.join(`", "`)}"`,
        );
    }
}

export function assertInRange(min: number, x: number, max: number) {
    if (x < min) {
        throw new Error(`${x} cannot be smaller than ${min}`);
    }

    if (x > max) {
        throw new Error(`${x} cannot be larger than ${max}`);
    }

    if (!Number.isSafeInteger(x)) {
        throw new Error(`${x} is not a safe integer`);
    }
}

export function assertStringLengthInRange(min: number, x: string, max: number) {
    if (x.length < min) {
        throw new Error(`"${x}" must be at least ${min} character(s) long`);
    }

    if (x.length > max) {
        throw new Error(`"${x}" must be at most ${max} character(s) long`);
    }
}
