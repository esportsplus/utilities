import { describe, expect, it } from 'vitest';
import { EMPTY_ARRAY, EMPTY_OBJECT } from '~/constants';
import { isArray, isAsyncFunction, isDate, isFunction, isInstanceOf, isMap, isNumber, isObject, isPromise, isRegExp, isSet, isString, isSymbol, noop } from '~/index';
import { parse, stringify } from '~/json';

import uuid from '~/uuid';


describe('type guards', () => {

    describe('isArray', () => {
        it.each([
            [[], true],
            [{}, false],
            ['str', false],
            [null, false]
        ])('isArray(%j) === %s', (value, expected) => {
            expect(isArray(value)).toBe(expected);
        });
    });

    describe('isAsyncFunction', () => {
        it.each([
            [async () => {}, true],
            [() => {}, false],
            [null, false]
        ])('isAsyncFunction(%j) === %s', (value, expected) => {
            expect(isAsyncFunction(value)).toBe(expected);
        });
    });

    describe('isDate', () => {
        it.each([
            [new Date(), true],
            ['2024-01-01', false],
            [null, false]
        ])('isDate(%j) === %s', (value, expected) => {
            expect(isDate(value)).toBe(expected);
        });
    });

    describe('isFunction', () => {
        it.each([
            [() => {}, true],
            [async () => {}, true],
            [class {}, true],
            [null, false]
        ])('isFunction(%j) === %s', (value, expected) => {
            expect(isFunction(value)).toBe(expected);
        });
    });

    describe('isInstanceOf', () => {
        it('should return true for matching constructor', () => {
            expect(isInstanceOf(new Map(), Map)).toBe(true);
        });

        it('should return false for non-matching constructor', () => {
            expect(isInstanceOf(new Map(), Set)).toBe(false);
        });
    });

    describe('isMap', () => {
        it.each([
            [new Map(), true],
            [{}, false]
        ])('isMap(%j) === %s', (value, expected) => {
            expect(isMap(value)).toBe(expected);
        });
    });

    describe('isNumber', () => {
        it.each([
            [42, true],
            [NaN, false],
            ['42', false],
            [null, false]
        ])('isNumber(%j) === %s', (value, expected) => {
            expect(isNumber(value)).toBe(expected);
        });
    });

    describe('isObject', () => {
        it.each([
            [{}, true],
            [[], false],
            [null, false],
            [new Map(), false]
        ])('isObject(%j) === %s', (value, expected) => {
            expect(isObject(value)).toBe(expected);
        });
    });

    describe('isPromise', () => {
        it('should return true for Promise.resolve()', () => {
            expect(isPromise(Promise.resolve())).toBe(true);
        });

        it('should return false for thenable object', () => {
            expect(isPromise({ then: () => {} })).toBe(false);
        });
    });

    describe('isRegExp', () => {
        it.each([
            [/test/, true],
            ['test', false]
        ])('isRegExp(%j) === %s', (value, expected) => {
            expect(isRegExp(value)).toBe(expected);
        });
    });

    describe('isSet', () => {
        it.each([
            [new Set(), true],
            [[], false]
        ])('isSet(%j) === %s', (value, expected) => {
            expect(isSet(value)).toBe(expected);
        });
    });

    describe('isString', () => {
        it.each([
            ['test', true],
            [42, false],
            [null, false]
        ])('isString(%j) === %s', (value, expected) => {
            expect(isString(value)).toBe(expected);
        });
    });

    describe('isSymbol', () => {
        it('should return true for Symbol()', () => {
            expect(isSymbol(Symbol())).toBe(true);
        });

        it('should return false for string', () => {
            expect(isSymbol('symbol')).toBe(false);
        });
    });

});


describe('noop', () => {

    it('should be a function that returns undefined', () => {
        expect(typeof noop).toBe('function');
        expect(noop()).toBeUndefined();
    });

});


describe('constants', () => {

    it('EMPTY_ARRAY is a frozen empty array', () => {
        expect(Array.isArray(EMPTY_ARRAY)).toBe(true);
        expect(EMPTY_ARRAY).toHaveLength(0);
        expect(Object.isFrozen(EMPTY_ARRAY)).toBe(true);
    });

    it('EMPTY_OBJECT is a frozen empty object', () => {
        expect(typeof EMPTY_OBJECT).toBe('object');
        expect(Object.keys(EMPTY_OBJECT)).toHaveLength(0);
        expect(Object.isFrozen(EMPTY_OBJECT)).toBe(true);
    });

});


describe('uuid', () => {

    it('should return a valid UUID v4 format string', () => {
        let id = uuid();
        let pattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

        expect(pattern.test(id)).toBe(true);
    });

    it('should return a unique value each call', () => {
        let a = uuid();
        let b = uuid();

        expect(a).not.toBe(b);
    });

});


describe('json', () => {

    it('parse and stringify are JSON.parse and JSON.stringify', () => {
        let obj = { a: 1, b: 'test' };

        expect(parse(stringify(obj))).toEqual(obj);
    });

    it('BigInt.toJSON returns string representation', () => {
        let value = BigInt('12345678901234567890');

        expect(value.toJSON()).toBe('12345678901234567890');
        expect(stringify(value)).toBe('"12345678901234567890"');
    });

});
