# @esportsplus/utilities

Zero-dependency TypeScript utility library.

## Install

```bash
pnpm add @esportsplus/utilities
```

## Usage

```typescript
import { bps, chunk, hash, omit, pick, slugify, ulid } from '@esportsplus/utilities';
```

## API

### bps

Basis point calculations with bigint and number overloads.

```typescript
bps(10_000n, 500)            // 500n (5% of 10,000)
bps(100, 500)                // 5 (5% of 100)
bps('100', 250)              // 2.5

bps.toDisplay({ raw: 500 })  // 5
bps.toRaw({ display: 5 })   // 500 (clamped to 10,000 max)
```

### chunk

Split an array into chunks of a given size.

```typescript
chunk([1, 2, 3, 4, 5], 2)   // [[1, 2], [3, 4], [5]]
```

### debounce

Debounce a function by a delay in milliseconds.

```typescript
let fn = debounce(() => save(), 300);
```

### decrypt / encrypt

AES-GCM encryption with PBKDF2 key derivation.

```typescript
let encrypted = await encrypt({ secret: 'data' }, 'password');
let decrypted = await decrypt<{ secret: string }>(encrypted, 'password');
```

### hash

SHA-256 hashing with optional HMAC. Objects are canonicalized (key-order independent).

```typescript
let h = await hash('value');
let hmac = await hash('value', 'secret');

hash.verify(a, b)            // timing-safe string comparison
```

### number

Number formatting utilities.

```typescript
number.abbreviate(1500)      // '1.5K'
number.ordinal(1)            // 'st'
number.ordinal(11)           // 'th'
```

### omit / pick

Object key filtering with array support.

```typescript
omit({ a: 1, b: 2, c: 3 }, ['b'])    // { a: 1, c: 3 }
pick({ a: 1, b: 2, c: 3 }, ['a'])    // { a: 1 }

omit([{ a: 1, b: 2 }, { a: 3, b: 4 }], ['b'])  // [{ a: 1 }, { a: 3 }]
```

### promise

Memory-safe promise utilities.

```typescript
// Abortable promise
await promise(fetch('/api'), AbortSignal.timeout(5000));

// Memory-leak-safe race (losing promises are settled)
await promise.race([fetchA(), fetchB()]);

// Retry with backoff
await promise.retry(() => fetch('/api'), { delay: 1000, retries: 3 });
```

### request

Fetch wrapper with defaults and body serialization.

```typescript
let data = await request<Response>('https://api.example.com/data');

let result = await request<Response>('https://api.example.com/data', {
    body: { key: 'value' },
    method: 'POST',
    search: { page: '1' },
});

request.url('https://example.com', { q: 'search' })
// 'https://example.com/?q=search'
```

### sleep

Promise-based delay.

```typescript
await sleep(1000);
```

### slugify

Convert a string to a URL-friendly slug.

```typescript
slugify('Hello World!')      // 'hello-world'
```

### toArray

Normalize a value to an array.

```typescript
toArray(null)                // []
toArray('value')             // ['value']
toArray([1, 2])              // [1, 2]
```

### truncate

String truncation utilities.

```typescript
truncate.center('abcdefghijklmnopqrstuvwxyz')   // 'abcde...tuvwxyz'
truncate.end('abcdefghijklmnop')                 // 'abcdefg...'
truncate.start('abcdefghijklmnop')               // '...jklmnop'
```

### ulid

ULID generation and validation (Crockford's Base32).

```typescript
let id = ulid.generate();
ulid.isValid(id)             // true
```

### uuid

UUID v4 generation.

```typescript
let id = uuid();             // 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
```

### Type Guards

```typescript
isArray, isAsyncFunction, isDate, isFunction, isInstanceOf,
isMap, isNumber, isObject, isPromise, isRegExp, isSet, isString, isSymbol
```

### Types

```typescript
Amount, BIPS, Brand, DeepReadonly, Function,
NeverAsync, NeverFunction, Prettify, Primitive, ULID, UnionRecord, UUID
```

### Constants

```typescript
EMPTY_ARRAY    // Object.freeze([])
EMPTY_OBJECT   // Object.freeze({})
noop           // () => {}
defineProperty // Object.defineProperty
```

## Scripts

```bash
pnpm build     # tsc && tsc-alias
pnpm test      # vitest run
```

## License

MIT
