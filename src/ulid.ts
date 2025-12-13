import { ULID } from './types';


// Crockford's Base32 (excludes I, L, O, U)
const ENCODING = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';

const RANDOM_LEN = 16;

const TIME_LEN = 10;

const TIME_MAX = 0xFFFFFFFFFFFF; // 2^48 - 1


// Pre-built lookup for validation (valid chars -> true)
const VALID_CHARACTERS: Record<string, boolean> = {};

for (let i = 0, n = ENCODING.length; i < n; i++) {
    let char = ENCODING[i];

    VALID_CHARACTERS[char] = true;
    VALID_CHARACTERS[char.toLowerCase()] = true;
}


function encodeRandom(len: number): string {
    // 10 random bytes = 80 bits, enough for 16 base32 chars (80 bits)
    let bytes = new Uint8Array(10),
        output = '';

    crypto.getRandomValues(bytes);

    // Process 5 bits at a time from the byte array
    let buffer = 0,
        bitsInBuffer = 0,
        byteIndex = 0;

    for (let i = 0; i < len; i++) {
        while (bitsInBuffer < 5) {
            buffer = (buffer << 8) | bytes[byteIndex++];
            bitsInBuffer += 8;
        }

        bitsInBuffer -= 5;
        output += ENCODING[(buffer >> bitsInBuffer) & 0x1F];
    }

    return output;
}

function encodeTime(timestamp: number, len: number): string {
    let output = '';

    for (let i = len; i > 0; i--) {
        output = ENCODING[timestamp % 32] + output;
        timestamp = Math.floor(timestamp / 32);
    }

    return output;
}


const generate = (seedTime?: number): ULID => {
    let timestamp = seedTime ?? Date.now();

    if (timestamp < 0 || timestamp > TIME_MAX || !Number.isInteger(timestamp)) {
        throw new Error(`Invalid timestamp: ${timestamp}`);
    }

    return (encodeTime(timestamp, TIME_LEN) + encodeRandom(RANDOM_LEN)) as ULID;
};

const isValid = (id: unknown): id is string => {
    if (typeof id !== 'string' || id.length !== 26) {
        return false;
    }

    // First char must be 0-7 (timestamp can't exceed 2^48-1)
    let first = id.charCodeAt(0);

    if (first < 48 || first > 55) { // '0' = 48, '7' = 55
        return false;
    }

    for (let i = 1; i < 26; i++) {
        if (!VALID_CHARACTERS[id[i]]) {
            return false;
        }
    }

    return true;
};


export default { generate, isValid };