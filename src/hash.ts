let encoder = new TextEncoder();


function bufferToHex(buffer: ArrayBuffer): string {
    let bytes = new Uint8Array(buffer),
        hex = '';

    for (let i = 0, n = bytes.length; i < n; i++) {
        hex += bytes[i].toString(16).padStart(2, '0');
    }

    return hex;
}

function canonicalize(value: unknown): string {
    if (value === null || value === undefined) {
        return String(value);
    }

    if (typeof value !== 'object') {
        return JSON.stringify(value);
    }

    if (Array.isArray(value)) {
        let items = '';

        for (let i = 0, n = value.length; i < n; i++) {
            items += (i > 0 ? ',' : '') + canonicalize(value[i]);
        }

        return '[' + items + ']';
    }

    let keys = Object.keys(value).sort(),
        items = '';

    for (let i = 0, n = keys.length; i < n; i++) {
        let k = keys[i];

        items += (i > 0 ? ',' : '') + JSON.stringify(k) + ':' + canonicalize((value as Record<string, unknown>)[k]);
    }

    return '{' + items + '}';
}

async function hash<T>(value: T): Promise<string>;
async function hash<T>(value: T, secret: string): Promise<string>;
async function hash<T>(value: T, secret?: string): Promise<string> {
    let data = encoder.encode(
            typeof value === 'string' ? value : canonicalize(value)
        );

    if (secret) {
        let key = await crypto.subtle.importKey(
                'raw',
                encoder.encode(secret),
                { hash: 'SHA-256', name: 'HMAC' },
                false,
                ['sign']
            );

        return bufferToHex( await crypto.subtle.sign('HMAC', key, data) );
    }

    return bufferToHex( await crypto.subtle.digest('SHA-256', data) );
}

hash.verify = (a: string, b: string): boolean => {
    let maxLen = Math.max(a.length, b.length),
        result = a.length ^ b.length;

    for (let i = 0; i < maxLen; i++) {
        result |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
    }

    return result === 0;
};


export default hash;