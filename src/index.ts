const bps = (amount: bigint | number | string, bps: number, max?: bigint | number | string) => {
    amount = Math.ceil( (Number(amount) * bps ) / 10_000 );

    if (max) {
        amount = Math.min(Number(max), amount);
    }

    return amount;
};

const chunk = <T>(items: T[], size: number) => {
    if (items.length <= size) {
        return [items];
    }

    return Array.from(
        { length: Math.ceil(items.length / size) },
        (_, i) => items.slice(i * size, i * size + size)
    );
};

const { defineProperty } = Object;

const { isArray } = Array;

const isFunction = (value: unknown): value is Function => {
    return typeof value === 'function';
};

const isInstanceOf = <T>(instance: unknown, match: new (...args: any) => T): instance is T => {
    return typeof instance === 'object' && instance !== null && instance.constructor === match;
};

const isNumber = (value: any): value is number => {
    return !isNaN(value);
};

const isObject = (value: unknown): value is Record<PropertyKey, unknown> => {
    return typeof value === 'object' && value !== null && value.constructor === Object;
};

const isString = (value: unknown): value is string => {
    return typeof value === 'string';
};

const request = async function<T>(url: string, init: RequestInit = {}): Promise<T> {
    init.cache ??= 'no-cache';
    init.headers ??= {};
    init.method = (init.method || 'GET').toUpperCase();
    init.redirect ??= 'follow';

    if (isObject(init.headers)) {
        init.headers['Content-Type'] ??= 'application/json';
    }

    if (init.method === 'POST') {
        init.body = isObject(init.body) ? JSON.stringify(init.body) : init.body;
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

const sleep = async (ms?: number) => {
    if (!ms) {
        return;
    }

    return new Promise(resolve => setTimeout(resolve, ms));
};

const truncate = {
    center: (str: string, { prefix, suffix }: { prefix?: number, suffix?: number } = {}) => {
        return str.slice(0, prefix || 5) + '...' + str.slice(str.length - (suffix || 7));
    },
    end: (str: string, prefix: number = 7) => {
        return str.slice(0, prefix) + '...';
    },
    start: (str: string, suffix: number = 7) => {
        return '...' + str.slice(str.length - suffix);
    }
};


export {
    bps,
    chunk,
    defineProperty,
    isArray, isFunction, isInstanceOf, isNumber, isObject, isString,
    request,
    sleep,
    truncate
};