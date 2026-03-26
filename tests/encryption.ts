import { describe, expect, it } from 'vitest';
import { decrypt, encrypt } from '~/encryption';


let password = 'test-password-123';


describe('encryption', () => {

    describe('round-trip', () => {

        it('string values', async () => {
            let original = 'hello world',
                encrypted = await encrypt(original, password),
                decrypted = await decrypt<string>(encrypted, password);

            expect(decrypted).toBe(original);
        });

        it('object values', async () => {
            let original = { bar: 'baz', foo: 123 },
                encrypted = await encrypt(original, password),
                decrypted = await decrypt<typeof original>(encrypted, password);

            expect(decrypted).toEqual(original);
        });

        it('array values', async () => {
            let original = [1, 'two', 3, true],
                encrypted = await encrypt(original, password),
                decrypted = await decrypt<typeof original>(encrypted, password);

            expect(decrypted).toEqual(original);
        });

        it('number values', async () => {
            let original = 42.5,
                encrypted = await encrypt(original, password),
                decrypted = await decrypt<number>(encrypted, password);

            expect(decrypted).toBe(original);
        });

        it('nested objects', async () => {
            let original = { a: { b: { c: [1, 2, { d: true }] } }, e: 'deep' },
                encrypted = await encrypt(original, password),
                decrypted = await decrypt<typeof original>(encrypted, password);

            expect(decrypted).toEqual(original);
        });

        it('null value', async () => {
            let encrypted = await encrypt(null, password),
                decrypted = await decrypt<null>(encrypted, password);

            expect(decrypted).toBeNull();
        });

    });


    describe('ciphertext format', () => {

        it('produces three dot-separated base64 segments', async () => {
            let encrypted = await encrypt('test', password),
                parts = encrypted.split('.');

            expect(parts).toHaveLength(3);

            for (let i = 0, n = parts.length; i < n; i++) {
                expect(parts[i].length).toBeGreaterThan(0);
                expect(() => Buffer.from(parts[i], 'base64')).not.toThrow();
            }
        });

    });


    describe('uniqueness', () => {

        it('different passwords produce different ciphertext', async () => {
            let content = 'same content',
                encrypted1 = await encrypt(content, 'password-a'),
                encrypted2 = await encrypt(content, 'password-b');

            expect(encrypted1).not.toBe(encrypted2);
        });

    });


    describe('error handling', () => {

        it('wrong password throws', async () => {
            let encrypted = await encrypt('secret', 'correct-password');

            await expect(decrypt(encrypted, 'wrong-password'))
                .rejects.toThrow('@esportsplus/crypto: decryption failed - invalid password or corrupted data');
        });

        it('invalid ciphertext format throws', async () => {
            await expect(decrypt('only-one-segment', password))
                .rejects.toThrow('@esportsplus/crypto: decrypt received invalid ciphertext format');

            await expect(decrypt('two.segments', password))
                .rejects.toThrow('@esportsplus/crypto: decrypt received invalid ciphertext format');

            await expect(decrypt('a.b.c.d', password))
                .rejects.toThrow('@esportsplus/crypto: decrypt received invalid ciphertext format');
        });

        it('tampered ciphertext throws', async () => {
            let encrypted = await encrypt('sensitive data', password),
                parts = encrypted.split('.'),
                tampered = parts[2].length > 1
                    ? String.fromCharCode(parts[2].charCodeAt(0) ^ 1) + parts[2].slice(1)
                    : 'x';

            parts[2] = tampered;

            await expect(decrypt(parts.join('.'), password))
                .rejects.toThrow('@esportsplus/crypto: decryption failed - invalid password or corrupted data');
        });

        it('empty string ciphertext throws', async () => {
            await expect(decrypt('', password))
                .rejects.toThrow('@esportsplus/crypto: decrypt received invalid ciphertext format');
        });

    });

});
