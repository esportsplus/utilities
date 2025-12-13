let decoder = new TextDecoder(),
    encoder = new TextEncoder(),
    iterations = 100000;


async function deriveKey(password: string, salt: Uint8Array, usage: 'decrypt' | 'encrypt') {
    let keyMaterial = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveKey']);

    return crypto.subtle.deriveKey(
        { hash: 'SHA-256', iterations, name: 'PBKDF2', salt: new Uint8Array(salt) },
        keyMaterial,
        { length: 256, name: 'AES-GCM' },
        false,
        [usage]
    );
}


const decrypt = async <T>(content: string, password: string): Promise<T> => {
    let parts = content.split('.');

    if (parts.length !== 3) {
        throw new Error('@esportsplus/crypto: decrypt received invalid ciphertext format');
    }

    try {
        let [saltB64, ivB64, ciphertextB64] = parts,
            decrypted = await crypto.subtle.decrypt(
                {
                    iv: Buffer.from(ivB64, 'base64'),
                    name: 'AES-GCM'
                },
                await deriveKey(password, Buffer.from(saltB64, 'base64'), 'decrypt'),
                Buffer.from(ciphertextB64, 'base64')
            );

        return JSON.parse(decoder.decode(decrypted));
    }
    catch {
        throw new Error('@esportsplus/crypto: decryption failed - invalid password or corrupted data');
    }
};

const encrypt = async <T>(content: T, password: string) => {
    let iv = crypto.getRandomValues(new Uint8Array(12)),
        salt = crypto.getRandomValues(new Uint8Array(16)),
        ciphertext = await crypto.subtle.encrypt(
            {
                iv,
                name: 'AES-GCM'
            },
            await deriveKey(password, salt, 'encrypt'),
            encoder.encode(JSON.stringify(content))
        );

    return [
        Buffer.from(salt).toString('base64'),
        Buffer.from(iv).toString('base64'),
        Buffer.from(ciphertext).toString('base64')
    ].join('.');
};


export { decrypt, encrypt };