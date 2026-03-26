import { describe, expect, it } from 'vitest';

import chunk from '~/chunk';


describe('chunk', () => {

    it('should split array into chunks of given size', () => {
        let result = chunk([1, 2, 3, 4, 5, 6], 2);

        expect(result).toEqual([[1, 2], [3, 4], [5, 6]]);
    });

    it('should return single chunk when size >= length', () => {
        let items = [1, 2, 3];

        expect(chunk(items, 3)).toEqual([items]);
        expect(chunk(items, 5)).toEqual([items]);
    });

    it('should handle last chunk being smaller', () => {
        let result = chunk([1, 2, 3, 4, 5], 3);

        expect(result).toEqual([[1, 2, 3], [4, 5]]);
    });

    it('should place each element in own chunk when size is 1', () => {
        let result = chunk([1, 2, 3], 1);

        expect(result).toEqual([[1], [2], [3]]);
    });

    it('should return [[]] for empty array (n <= size)', () => {
        let result = chunk([], 5);

        expect(result).toEqual([[]]);
    });

});
