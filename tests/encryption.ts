import { describe, expect, it } from 'vitest';
import encryption from '~/encryption';


let password = 'test-password-123';


describe('encryption', () => {

    describe('round-trip', () => {

        it('string values', async () => {
            let cipher = await encryption(password),
                original = 'hello world',
                encrypted = await cipher.encrypt(original),
                decrypted = await cipher.decrypt<string>(encrypted);

            expect(decrypted).toBe(original);
        });

        it('object values', async () => {
            let cipher = await encryption(password),
                original = { bar: 'baz', foo: 123 },
                encrypted = await cipher.encrypt(original),
                decrypted = await cipher.decrypt<typeof original>(encrypted);

            expect(decrypted).toEqual(original);
        });

        it('array values', async () => {
            let cipher = await encryption(password),
                original = [1, 'two', 3, true],
                encrypted = await cipher.encrypt(original),
                decrypted = await cipher.decrypt<typeof original>(encrypted);

            expect(decrypted).toEqual(original);
        });

        it('number values', async () => {
            let cipher = await encryption(password),
                original = 42.5,
                encrypted = await cipher.encrypt(original),
                decrypted = await cipher.decrypt<number>(encrypted);

            expect(decrypted).toBe(original);
        });

        it('nested objects', async () => {
            let cipher = await encryption(password),
                original = { a: { b: { c: [1, 2, { d: true }] } }, e: 'deep' },
                encrypted = await cipher.encrypt(original),
                decrypted = await cipher.decrypt<typeof original>(encrypted);

            expect(decrypted).toEqual(original);
        });

        it('null value', async () => {
            let cipher = await encryption(password),
                encrypted = await cipher.encrypt(null),
                decrypted = await cipher.decrypt<null>(encrypted);

            expect(decrypted).toBeNull();
        });

    });


    describe('key caching', () => {

        it('multiple encrypts reuse same salt prefix', async () => {
            let cipher = await encryption(password),
                encrypted1 = await cipher.encrypt('a'),
                encrypted2 = await cipher.encrypt('b'),
                salt1 = encrypted1.split('.')[0],
                salt2 = encrypted2.split('.')[0];

            expect(salt1).toBe(salt2);
        });

        it('multiple encrypts produce different ciphertext (unique IV)', async () => {
            let cipher = await encryption(password),
                encrypted1 = await cipher.encrypt('same'),
                encrypted2 = await cipher.encrypt('same');

            expect(encrypted1).not.toBe(encrypted2);
        });

        it('decrypt caches keys per salt', async () => {
            let cipher1 = await encryption(password),
                cipher2 = await encryption(password),
                encrypted1 = await cipher1.encrypt('from-cipher-1'),
                encrypted2 = await cipher2.encrypt('from-cipher-2'),
                decrypted1 = await cipher1.decrypt<string>(encrypted1),
                decrypted2 = await cipher1.decrypt<string>(encrypted2);

            expect(decrypted1).toBe('from-cipher-1');
            expect(decrypted2).toBe('from-cipher-2');
        });

    });


    describe('ciphertext format', () => {

        it('produces three dot-separated base64 segments', async () => {
            let cipher = await encryption(password),
                encrypted = await cipher.encrypt('test'),
                parts = encrypted.split('.');

            expect(parts).toHaveLength(3);

            for (let i = 0, n = parts.length; i < n; i++) {
                expect(parts[i].length).toBeGreaterThan(0);
                expect(() => atob(parts[i])).not.toThrow();
            }
        });

    });


    describe('uniqueness', () => {

        it('different passwords produce different ciphertext', async () => {
            let cipher1 = await encryption('password-a'),
                cipher2 = await encryption('password-b'),
                content = 'same content',
                encrypted1 = await cipher1.encrypt(content),
                encrypted2 = await cipher2.encrypt(content);

            expect(encrypted1).not.toBe(encrypted2);
        });

        it('different instances produce different ciphertext (random salt)', async () => {
            let cipher1 = await encryption(password),
                cipher2 = await encryption(password),
                content = 'same content',
                encrypted1 = await cipher1.encrypt(content),
                encrypted2 = await cipher2.encrypt(content);

            expect(encrypted1).not.toBe(encrypted2);
        });

    });


    describe('error handling', () => {

        it('wrong password throws', async () => {
            let cipher1 = await encryption('correct-password'),
                cipher2 = await encryption('wrong-password'),
                encrypted = await cipher1.encrypt('secret');

            await expect(cipher2.decrypt(encrypted))
                .rejects.toThrow('@esportsplus/crypto: decryption failed - invalid password or corrupted data');
        });

        it('invalid ciphertext format throws', async () => {
            let cipher = await encryption(password);

            await expect(cipher.decrypt('only-one-segment'))
                .rejects.toThrow('@esportsplus/crypto: decrypt received invalid ciphertext format');

            await expect(cipher.decrypt('two.segments'))
                .rejects.toThrow('@esportsplus/crypto: decrypt received invalid ciphertext format');

            await expect(cipher.decrypt('a.b.c.d'))
                .rejects.toThrow('@esportsplus/crypto: decrypt received invalid ciphertext format');
        });

        it('tampered ciphertext throws', async () => {
            let cipher = await encryption(password),
                encrypted = await cipher.encrypt('sensitive data'),
                parts = encrypted.split('.'),
                tampered = parts[2].length > 1
                    ? String.fromCharCode(parts[2].charCodeAt(0) ^ 1) + parts[2].slice(1)
                    : 'x';

            parts[2] = tampered;

            await expect(cipher.decrypt(parts.join('.')))
                .rejects.toThrow('@esportsplus/crypto: decryption failed - invalid password or corrupted data');
        });

        it('empty string ciphertext throws', async () => {
            let cipher = await encryption(password);

            await expect(cipher.decrypt(''))
                .rejects.toThrow('@esportsplus/crypto: decrypt received invalid ciphertext format');
        });

    });

});
