import { describe, expect, it } from 'vitest';

import pick from '~/pick';


describe('pick', () => {

    it('should pick specified keys from object', () => {
        let result = pick({ a: 1, b: 2, c: 3 }, ['a', 'c']);

        expect(result).toEqual({ a: 1, c: 3 });
    });

    it('should return empty object when picking none', () => {
        let result = pick({ a: 1, b: 2, c: 3 }, []);

        expect(result).toEqual({});
    });

    it('should return full object when picking all keys', () => {
        let result = pick({ a: 1, b: 2, c: 3 }, ['a', 'b', 'c']);

        expect(result).toEqual({ a: 1, b: 2, c: 3 });
    });

    it('should work with array of objects', () => {
        let data = [
                { a: 1, b: 2, c: 3 },
                { a: 4, b: 5, c: 6 }
            ],
            result = pick(data, ['a', 'c']);

        expect(result).toEqual([
            { a: 1, c: 3 },
            { a: 4, c: 6 }
        ]);
    });

    it('should filter out empty rows from array result', () => {
        let data = [
                { a: 1 },
                { a: 2, b: 3 }
            ],
            result = pick(data, ['b']);

        expect(result).toEqual([{ b: 3 }]);
    });

    it('should ignore keys not present in object', () => {
        let data = { a: 1, b: 2 },
            result = pick(data, ['a', 'c' as keyof typeof data]);

        expect(result).toEqual({ a: 1 });
    });

});
