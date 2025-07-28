import { isArray } from '.';


type Data<T> = T | T[] | ReadonlyArray<T>;

type Response<T, K extends keyof T> =
    T extends unknown[] | ReadonlyArray<unknown>
        ? Array<Omit<T[number], K>>
        : Omit<T, K>;


export default function omit<T extends Record<PropertyKey, unknown>, K extends keyof T>(
    data: Data<T | Readonly<T>>,
    keys: readonly K[]
): Response<T, K> {
    if (isArray(data)) {
        let response = [];

        for (let i = 0, n = data.length; i < n; i++) {
            response.push( omit(data[i], keys) );
        }

        return response as Response<T, K>;
    }

    let response: Record<PropertyKey, unknown> = { ...data };

    for (let i = 0; i < keys.length; i++) {
        delete response[keys[i]];
    }

    return response as Response<T, K>;
}