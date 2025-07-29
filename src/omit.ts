import { isArray } from '.';


type Response<T, K extends keyof T> =
    T extends unknown[] | ReadonlyArray<unknown>
        ? Array<Omit<T[number], K>>
        : Omit<T, K>;


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

        return rows as Response<T, K>;
    }

    let row: Record<PropertyKey, unknown> = { ...data };

    for (let i = 0; i < keys.length; i++) {
        delete row[keys[i]];
    }

    return row as Response<T, K>;
}