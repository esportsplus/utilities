import { describe, expect, it } from 'vitest';

import toArray from '~/toArray';


describe('toArray', () => {

    it('should return empty array for null', () => {
        expect(toArray(null)).toEqual([]);
    });

    it('should return empty array for undefined', () => {
        expect(toArray(undefined)).toEqual([]);
    });

    it('should return same array when input is an array', () => {
        let items = [1, 2, 3];

        expect(toArray(items)).toBe(items);
    });

    it('should wrap single value in array', () => {
        expect(toArray(42)).toEqual([42]);
    });

    it('should wrap string in array without splitting', () => {
        expect(toArray('hello')).toEqual(['hello']);
    });

});
