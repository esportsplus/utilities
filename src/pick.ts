import { isArray } from '.';


type Data<T> = T | T[] | ReadonlyArray<T>;

type Response<T, K extends keyof T> =
    T extends any[] | ReadonlyArray<any>
        ? Array<Pick<T[number], K>>
        : Pick<T, K>;


export default function pick<T extends Record<PropertyKey, unknown>, K extends keyof T>(
    data: Data<T | Readonly<T>>,
    keys: readonly K[]
): Response<T, K> {
    if (isArray(data)) {
        let response = [];

        for (let i = 0, n = data.length; i < n; i++) {
            response.push(pick(data[i], keys));
        }

        return response as Response<T, K>;
    }

    let response: Record<PropertyKey, unknown> = {};

    for (let i = 0; i < keys.length; i++) {
        let key = keys[i];

        response[key] = data[key as keyof typeof data];
    }

    return response as Response<T, K>;
};
