import { describe, expect, it } from 'vitest';

import ulid from '~/ulid';


let TIME_MAX = 0xFFFFFFFFFFFF;


describe('ulid', () => {

    describe('generate', () => {

        it('returns a 26-character string', () => {
            let id = ulid.generate();

            expect(id).toHaveLength(26);
            expect(typeof id).toBe('string');
        });

        it('generated ULID passes isValid', () => {
            let id = ulid.generate();

            expect(ulid.isValid(id)).toBe(true);
        });

        it('seedTime=0 produces valid ULID starting with 0', () => {
            let id = ulid.generate(0);

            expect(ulid.isValid(id)).toBe(true);
            expect(id[0]).toBe('0');
        });

        it('seedTime at TIME_MAX boundary produces valid ULID', () => {
            let id = ulid.generate(TIME_MAX);

            expect(ulid.isValid(id)).toBe(true);
        });

        it('negative timestamp throws', () => {
            expect(() => ulid.generate(-1)).toThrow('Invalid timestamp');
        });

        it('timestamp > TIME_MAX throws', () => {
            expect(() => ulid.generate(TIME_MAX + 1)).toThrow('Invalid timestamp');
        });

        it('non-integer timestamp throws', () => {
            expect(() => ulid.generate(1.5)).toThrow('Invalid timestamp');
        });

        it('two generated ULIDs are unique', () => {
            let a = ulid.generate(),
                b = ulid.generate();

            expect(a).not.toBe(b);
        });

        it('same seedTime produces same 10-char prefix', () => {
            let seed = 1000000,
                a = ulid.generate(seed),
                b = ulid.generate(seed);

            expect(a.slice(0, 10)).toBe(b.slice(0, 10));
        });

    });


    describe('isValid', () => {

        it('valid ULID returns true', () => {
            let id = ulid.generate();

            expect(ulid.isValid(id)).toBe(true);
        });

        it('wrong length returns false', () => {
            expect(ulid.isValid('0123456789ABCDEFGHJKMNPQRS1')).toBe(false);
            expect(ulid.isValid('0123456789ABCDEFGHJKMNPQR')).toBe(false);
        });

        it('non-string returns false', () => {
            expect(ulid.isValid(123)).toBe(false);
            expect(ulid.isValid(null)).toBe(false);
            expect(ulid.isValid(undefined)).toBe(false);
        });

        it('invalid first character (>7) returns false', () => {
            expect(ulid.isValid('8BCDEFGHJKMNPQRSTVWXYZ0123')).toBe(false);
            expect(ulid.isValid('9BCDEFGHJKMNPQRSTVWXYZ0123')).toBe(false);
        });

        it('invalid characters (I, L, O, U) return false', () => {
            let base = ulid.generate();

            expect(ulid.isValid(base.slice(0, 1) + 'I' + base.slice(2))).toBe(false);
            expect(ulid.isValid(base.slice(0, 1) + 'L' + base.slice(2))).toBe(false);
            expect(ulid.isValid(base.slice(0, 1) + 'O' + base.slice(2))).toBe(false);
            expect(ulid.isValid(base.slice(0, 1) + 'U' + base.slice(2))).toBe(false);
        });

        it('lowercase valid ULID returns true', () => {
            let id = ulid.generate();

            expect(ulid.isValid(id.toLowerCase())).toBe(true);
        });

        it('empty string returns false', () => {
            expect(ulid.isValid('')).toBe(false);
        });

    });

});
