const bps = (amount: bigint | number | string, bps: number, max?: bigint | number | string) => {
    amount = Math.ceil( (Number(amount) * bps ) / 10_000 );

    if (max) {
        amount = Math.min(Number(max), amount);
    }

    return amount;
};

const chunk = <T>(items: T[], size: number) => {
    return Array.from({ length: Math.ceil(items.length / size) }, (_, i) =>
        items.slice(i * size, i * size + size)
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

const sleep = (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, Math.max(ms, 0)));
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
    sleep,
    truncate
};