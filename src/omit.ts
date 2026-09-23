import { isArray } from '.';


type Response<T, K extends keyof T> =
    T extends unknown[] | ReadonlyArray<unknown>
        ? Without<T[number], K>[]
        : Without<T, K>;

// Key remapping instead of Omit: Omit collapses types with index signatures to the index signature alone
type Without<T, K extends PropertyKey> = {
    [P in keyof T as P extends K ? never : P]: T[P];
};


export default function omit<T extends Record<PropertyKey, unknown>, K extends keyof T>(
    data: T | Readonly<T> | T[] | ReadonlyArray<T>,
    keys: readonly K[]
): Response<T, K> {
    if (isArray(data)) {
        let rows = [];

        for (let i = 0, n = data.length; i < n; i++) {
            let row = omit(data[i], keys);

            if (Object.keys(row).length) {
                rows.push(row);
            }
        }

        return rows as any as Response<T, K>;
    }

    let allkeys = Object.keys(data),
        row: Record<PropertyKey, unknown> = {};

    for (let i = 0, n = allkeys.length; i < n; i++) {
        let key = allkeys[i];

        if (keys.indexOf(key as K) === -1) {
            row[key] = data[key as keyof typeof data];
        }
    }

    return row as Response<T, K>;
};