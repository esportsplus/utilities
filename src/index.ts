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


export { defineProperty, isArray, isFunction, isInstanceOf, isNumber, isObject, isString };
export { default as bps } from './bps';
export { default as chunk } from './chunk';
export { default as number } from './number';
export { default as pick } from './pick';
export { default as promise } from './promise';
export { default as request } from './request';
export { default as sleep } from './sleep';
export { default as truncate } from './truncate';
export type * from './types';