import { isArray } from '.';


type Response<T, K extends keyof T> =
    T extends any[] | ReadonlyArray<unknown>
        ? Array<Pick<T[number], K>>
        : Pick<T, K>;


export default function pick<T extends Record<PropertyKey, unknown>, K extends keyof T>(
    data: T | Readonly<T> | T[] | ReadonlyArray<T>,
    keys: readonly K[]
): Response<T, K> {
    if (isArray(data)) {
        let rows = [];

        for (let i = 0, n = data.length; i < n; i++) {
            let row = pick(data[i], keys);

            if (Object.keys(row).length) {
                rows.push(row);
            }
        }

        return rows as Response<T, K>;
    }

    let row: Record<PropertyKey, unknown> = {};

    for (let i = 0; i < keys.length; i++) {
        let key = keys[i];

        if (key in data) {
            row[key] = data[key as keyof typeof data];
        }
    }

    return row as Response<T, K>;
};
