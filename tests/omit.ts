import { describe, expect, it } from 'vitest';

import omit from '~/omit';


describe('omit', () => {

    it('should omit specified keys from object', () => {
        let result = omit({ a: 1, b: 2, c: 3 }, ['b']);

        expect(result).toEqual({ a: 1, c: 3 });
    });

    it('should return all keys when omitting none', () => {
        let data = { a: 1, b: 2, c: 3 },
            result = omit(data, []);

        expect(result).toEqual({ a: 1, b: 2, c: 3 });
    });

    it('should return empty object when omitting all keys', () => {
        let result = omit({ a: 1, b: 2 }, ['a', 'b']);

        expect(result).toEqual({});
    });

    it('should work with array of objects', () => {
        let data = [
                { a: 1, b: 2, c: 3 },
                { a: 4, b: 5, c: 6 }
            ],
            result = omit(data, ['b']);

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
            result = omit(data, ['a']);

        expect(result).toEqual([{ b: 3 }]);
    });

    it('should handle keys not present in object', () => {
        let data = { a: 1, b: 2 },
            result = omit(data, ['c' as keyof typeof data]);

        expect(result).toEqual({ a: 1, b: 2 });
    });

});
