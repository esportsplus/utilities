import { describe, expect, it } from 'vitest';

import slugify from '~/slugify';


describe('slugify', () => {

    it('should lowercase input', () => {
        expect(slugify('HELLO')).toBe('hello');
    });

    it('should replace spaces with dashes', () => {
        expect(slugify('hello world')).toBe('hello-world');
    });

    it('should replace special characters with dashes', () => {
        expect(slugify('hello@world!test')).toBe('hello-world-test');
    });

    it('should remove trailing dashes', () => {
        expect(slugify('hello world!')).toBe('hello-world');
    });

    it('should collapse multiple consecutive non-word chars to single dash', () => {
        expect(slugify('hello   &  world')).toBe('hello-world');
    });

    it('should return unchanged when already a valid slug', () => {
        expect(slugify('hello-world')).toBe('hello-world');
    });

    it('should return empty string for empty input', () => {
        expect(slugify('')).toBe('');
    });

    it('should handle unicode characters', () => {
        expect(slugify('café résumé')).toBe('caf-r-sum');
    });

    it('should keep leading dashes from non-word start', () => {
        expect(slugify('!hello')).toBe('-hello');
    });

});
