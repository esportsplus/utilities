import { describe, expect, it } from 'vitest';

import truncate from '~/truncate';


describe('truncate', () => {

    describe('center', () => {

        it('should return full string when short enough', () => {
            let result = truncate.center('hello world');

            expect(result).toBe('hello world');
        });

        it('should truncate center with default prefix and suffix', () => {
            let result = truncate.center('abcdefghijklmnopqrstuvwxyz');

            expect(result).toBe('abcde...tuvwxyz');
        });

        it('should truncate center with custom prefix and suffix', () => {
            let result = truncate.center('abcdefghijklmnopqrstuvwxyz', { prefix: 3, suffix: 4 });

            expect(result).toBe('abc...wxyz');
        });

    });

    describe('end', () => {

        it('should truncate to prefix with ellipsis', () => {
            let result = truncate.end('abcdefghijklmnop');

            expect(result).toBe('abcdefg...');
        });

        it('should truncate with custom prefix length', () => {
            let result = truncate.end('abcdefghijklmnop', 3);

            expect(result).toBe('abc...');
        });

        it('should append ellipsis even for short strings', () => {
            let result = truncate.end('hi');

            expect(result).toBe('hi...');
        });

    });

    describe('start', () => {

        it('should truncate to ellipsis with suffix', () => {
            let result = truncate.start('abcdefghijklmnop');

            expect(result).toBe('...jklmnop');
        });

        it('should truncate with custom suffix length', () => {
            let result = truncate.start('abcdefghijklmnop', 3);

            expect(result).toBe('...nop');
        });

        it('should prepend ellipsis even for short strings', () => {
            let result = truncate.start('hi');

            expect(result).toBe('...hi');
        });

    });

});
