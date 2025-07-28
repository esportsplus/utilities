import { isArray } from '.';


type Response<T extends Record<PropertyKey, unknown>, K extends keyof T> = T extends unknown[]
    ? Omit<T, K>[]
    : Omit<T, K>;


export default function omit<T extends Record<PropertyKey, unknown>, K extends keyof T>(data: T | T[], keys: K[]): Response<T, K> {
    if (isArray(data)) {
        let response = [];

        for (let i = 0, n = data.length; i < n; i++) {
            response.push( omit(data[i], keys) );
        }

        return response as Response<T, K>;
    }

    let response: Record<PropertyKey, unknown> = {};

    for (let key in data) {
        if (keys.indexOf(key as any as K) !== -1) {
            continue;
        }

        response[key] = data[key];
    }

    return response as Response<T, K>;
};