let objToString: typeof Object.prototype.toString = Object.prototype.toString,
    type = (value: unknown): string => objToString.call(value)


const { defineProperty } = Object;

const { isArray } = Array;

const isAsyncFunction = (value: unknown): value is ((...args: any[]) => Promise<any>) => {
    return type(value) === '[object AsyncFunction]';
};

const isDate = (val: unknown): val is Date => {
    return type(val) === '[object Date]';
};

const isFunction = (value: unknown): value is Function => {
    return typeof value === 'function';
};

const isInstanceOf = <T>(instance: unknown, match: new (...args: any) => T): instance is T => {
    return typeof instance === 'object' && instance !== null && instance.constructor === match;
};

const isMap = (val: unknown): val is Map<any, any> => {
    return type(val) === '[object Map]';
};

const isNumber = (value: unknown): value is number => {
    return typeof value === 'number' && !Number.isNaN(value);
};

const isObject = (value: unknown): value is Record<PropertyKey, unknown> => {
    return typeof value === 'object' && value !== null && value.constructor === Object;
};

const isPromise = <T = any>(val: unknown): val is Promise<T> => {
    return val instanceof Promise;
};

const isSet = (val: unknown): val is Set<any> => {
    return type(val) === '[object Set]';
};

const isString = (value: unknown): value is string => {
    return typeof value === 'string';
};

const isRegExp = (val: unknown): val is RegExp => {
    return type(val) === '[object RegExp]';
};

const isSymbol = (val: unknown): val is symbol => {
    return typeof val === 'symbol';
};

const noop = (() => {}) as VoidFunction;


export {
    defineProperty,
    isArray, isAsyncFunction, isDate, isFunction, isInstanceOf, isMap, isNumber, isObject, isPromise, isRegExp, isSet, isString, isSymbol,
    noop
};
export * from './json';
export { Cipher } from './encryption';
export { default as encryption } from './encryption';
export type * from './types';
export { default as bps } from './bps';
export { default as chunk } from './chunk';
export { EMPTY_ARRAY, EMPTY_OBJECT } from './constants';
export { default as debounce } from './debounce';
export { default as hash } from './hash';
export { default as number } from './number';
export { default as omit } from './omit';
export { default as pick } from './pick';
export { default as promise } from './promise';
export { default as request } from './request';
export { default as sleep } from './sleep';
export { default as slugify } from './slugify';
export { default as toArray } from './toArray';
export { default as truncate } from './truncate';
export { default as ulid } from './ulid';
export { default as uuid } from './uuid';