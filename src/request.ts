import { isObject } from '.';


type Init = Omit<RequestInit, 'body' | 'method'> & {
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    search?: Record<string, string>,
} & (
    {
        body?: RequestInit['body'] | Record<string, any> | string | null,
        method: 'POST' | 'PUT' | 'PATCH',
    } | {
        body?: RequestInit['body'],
        method: 'GET' | 'DELETE',
    }
);


const request = async function<T>(url: string, init: Init = { method: 'GET' }): Promise<T> {
    init.cache ??= 'no-cache';
    init.headers ??= {};
    init.method ??= 'GET';
    init.redirect ??= 'follow';

    if (isObject(init.headers)) {
        init.headers['Content-Type'] ??= 'application/json';
    }

    let method = init.method;

    if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
        init.body = isObject(init.body) ? JSON.stringify(init.body) : init.body;
        init.mode ??= 'cors';
        init.referrerPolicy ??= 'no-referrer';
    }

    if (init.search) {
        url = request.url(url, init.search);
    }

    return await fetch(url, init as RequestInit).then(r => {
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