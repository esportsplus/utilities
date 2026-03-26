import { describe, expect, it } from 'vitest';

import hash from '~/hash';


let HEX_REGEX = /^[0-9a-f]{64}$/;


describe('hash', () => {

    describe('SHA-256', () => {

        it('should produce deterministic output for the same string', async () => {
            let a = await hash('hello world'),
                b = await hash('hello world');

            expect(a).toBe(b);
        });

        it('should produce deterministic output for objects regardless of key order', async () => {
            let a = await hash({ a: 1, b: 2, c: 3 }),
                b = await hash({ c: 3, a: 1, b: 2 });

            expect(a).toBe(b);
        });

        it('should produce deterministic output for arrays', async () => {
            let a = await hash([1, 'two', 3]),
                b = await hash([1, 'two', 3]);

            expect(a).toBe(b);
        });

        it('should produce a valid hex string for null', async () => {
            let result = await hash(null);

            expect(result).toMatch(HEX_REGEX);
        });

        it('should produce a valid hex string for undefined', async () => {
            let result = await hash(undefined);

            expect(result).toMatch(HEX_REGEX);
        });

        it('should produce deterministic key-order-independent output for nested objects', async () => {
            let a = await hash({ x: { b: 2, a: 1 }, y: [3, 4] }),
                b = await hash({ y: [3, 4], x: { a: 1, b: 2 } });

            expect(a).toBe(b);
        });

    });


    describe('HMAC', () => {

        it('should produce deterministic output for the same input and secret', async () => {
            let a = await hash('data', 'secret'),
                b = await hash('data', 'secret');

            expect(a).toBe(b);
        });

        it('should produce different output for different secrets', async () => {
            let a = await hash('data', 'secret-1'),
                b = await hash('data', 'secret-2');

            expect(a).not.toBe(b);
        });

    });


    describe('output format', () => {

        it('should produce a 64-character lowercase hex string', async () => {
            let result = await hash('test');

            expect(result).toMatch(HEX_REGEX);
        });

    });


    describe('verify', () => {

        it('should return true for identical strings', () => {
            expect(hash.verify('abc123', 'abc123')).toBe(true);
        });

        it('should return false for different strings', () => {
            expect(hash.verify('abc123', 'xyz789')).toBe(false);
        });

        it('should return false for strings of different lengths', () => {
            expect(hash.verify('short', 'muchlonger')).toBe(false);
        });

        it('should return true for two empty strings', () => {
            expect(hash.verify('', '')).toBe(true);
        });

    });


    describe('round-trip', () => {

        it('should verify that two hashes of the same value match', async () => {
            let a = await hash({ key: 'value' }),
                b = await hash({ key: 'value' });

            expect(hash.verify(a, b)).toBe(true);
        });

    });

});
