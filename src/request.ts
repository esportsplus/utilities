import { isObject } from '.';


const request = async function<T>(url: string, init: (RequestInit & { body?: Record<string, any> | string | null }) = {}): Promise<T> {
    init.body = isObject(init.body) ? JSON.stringify(init.body) : init.body;
    init.cache ??= 'no-cache';
    init.headers ??= {};
    init.method = (init.method || 'GET').toUpperCase();
    init.redirect ??= 'follow';

    if (isObject(init.headers)) {
        init.headers['Content-Type'] ??= 'application/json';
    }

    if (init.method === 'POST') {
        init.mode ??= 'cors';
        init.referrerPolicy ??= 'no-referrer';
    }

    return await fetch(url, init).then(r => {
        if (isObject(init.headers) && init.headers['Content-Type'] === 'application/json') {
            return r.json();
        }

        return r.text();
    });
};

request.url = (url: string, search?: Record<string, string>) => {
    let input = new URL(url);

    input.search = new URLSearchParams(search || '').toString();

    return input.toString();
};


export default request;