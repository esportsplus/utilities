const MAX_CACHED_KEYS = 64;


let decoder = new TextDecoder(),
    encoder = new TextEncoder();



function deriveKey(iterations: number, material: CryptoKey, salt: Uint8Array, usage: 'decrypt' | 'encrypt') {
    return crypto.subtle.deriveKey(
        { hash: 'SHA-256', iterations, name: 'PBKDF2', salt: new Uint8Array(salt) },
        material,
        { length: 256, name: 'AES-GCM' },
        false,
        [usage]
    );
}

function fromBase64(b64: string) {
    let binary = atob(b64),
        bytes = new Uint8Array(binary.length);

    for (let i = 0, n = binary.length; i < n; i++) {
        bytes[i] = binary.charCodeAt(i);
    }

    return bytes;
}

function toBase64(buffer: ArrayBuffer | Uint8Array) {
    let bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer),
        binary = '';

    for (let i = 0, n = bytes.length; i < n; i++) {
        binary += String.fromCharCode(bytes[i]);
    }

    return btoa(binary);
}


class Cipher {
    private decryptKeys = new Map<string, CryptoKey>();
    private encryptKey: CryptoKey;
    private iterations: number;
    private material: CryptoKey;
    private salt: Uint8Array;


    constructor(encryptKey: CryptoKey, iterations: number, material: CryptoKey, salt: Uint8Array) {
        this.encryptKey = encryptKey;
        this.iterations = iterations;
        this.material = material;
        this.salt = salt;
    }


    async decrypt<T>(content: string): Promise<T> {
        let parts = content.split('.');

        if (parts.length !== 3) {
            throw new Error('@esportsplus/crypto: decrypt received invalid ciphertext format');
        }

        try {
            let [saltB64, ivB64, ciphertextB64] = parts,
                key = this.decryptKeys.get(saltB64);

            if (!key) {
                key = await deriveKey(this.iterations, this.material, fromBase64(saltB64), 'decrypt');

                if (this.decryptKeys.size >= MAX_CACHED_KEYS) {
                    this.decryptKeys.delete(this.decryptKeys.keys().next().value!);
                }

                this.decryptKeys.set(saltB64, key);
            }

            let decrypted = await crypto.subtle.decrypt(
                    {
                        iv: fromBase64(ivB64),
                        name: 'AES-GCM'
                    },
                    key,
                    fromBase64(ciphertextB64)
                );

            return JSON.parse(decoder.decode(decrypted));
        }
        catch {
            throw new Error('@esportsplus/crypto: decryption failed - invalid password or corrupted data');
        }
    }

    async encrypt<T>(content: T) {
        let iv = crypto.getRandomValues(new Uint8Array(12)),
            ciphertext = await crypto.subtle.encrypt(
                {
                    iv,
                    name: 'AES-GCM'
                },
                this.encryptKey,
                encoder.encode(JSON.stringify(content))
            );

        return [
            toBase64(this.salt),
            toBase64(iv),
            toBase64(ciphertext)
        ].join('.');
    }
}


export default async (password: string, iterations = 100000) => {
    let material = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveKey']),
        salt = crypto.getRandomValues(new Uint8Array(16)),
        encryptKey = await deriveKey(iterations, material, salt, 'encrypt');

    return new Cipher(encryptKey, iterations, material, salt);
};
export type { Cipher };