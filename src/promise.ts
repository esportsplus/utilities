// @see @solana/promises
import { isObject } from '.';
import sleep from './sleep';


type Deferred = Readonly<{
    reject: (reason?: unknown) => void;
    resolve: (value: unknown) => void;
}>;


// Keys are the values passed to race, values are a record of data containing a
// set of deferreds and whether the value has settled.
let wm = new WeakMap<object, { deferreds: Set<Deferred>; settled: boolean }>();


// This promise only ever rejects if the signal is aborted. Otherwise it idles forever.
// It's important that this come before the input promise; in the event of an abort, we
// want to throw even if the input promise's result is ready
function abortablePromise(abortSignal: AbortSignal): Promise<never> {
    return new Promise<never>((_, reject) => {
        if (abortSignal.aborted) {
            reject(abortSignal.reason);
        }
        else {
            abortSignal.addEventListener('abort', function () {
                reject(this.reason);
            });
        }
    });
}

function addRaceContender(contender: object) {
    let deferreds = new Set<Deferred>(),
        record = { deferreds, settled: false };

    // This call to `then` happens once for the lifetime of the value.
    Promise.resolve(contender).then(
        (value) => {
            for (const { resolve } of deferreds) {
                resolve(value);
            }

            deferreds.clear();
            record.settled = true;
        },
        (err) => {
            for (const { reject } of deferreds) {
                reject(err);
            }

            deferreds.clear();
            record.settled = true;
        },
    );

    return record;
}


/**
 * Returns a new promise that will reject if the abort signal fires before the original promise
 * settles. Resolves or rejects with the value of the original promise otherwise.
 *
 * @example
 * ```ts
 * const result = await getAbortablePromise(
 *     // Resolves or rejects when `fetch` settles.
 *     fetch('https://example.com/json').then(r => r.json()),
 *     // ...unless it takes longer than 5 seconds, after which the `AbortSignal` is triggered.
 *     AbortSignal.timeout(5000),
 * );
 * ```
 */
const host = <T>(promise: Promise<T>, abortSignal?: AbortSignal): Promise<T> => {
    if (!abortSignal) {
        return promise;
    }

    return host.race([ abortablePromise(abortSignal), promise ]);
};

/**
 * An implementation of [`Promise.race`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/race)
 * that causes all of the losing promises to settle. This allows them to be released and garbage
 * collected, preventing memory leaks.
 *
 * Read more here: https://github.com/nodejs/node/issues/17469
 */
host.race = async <T extends readonly unknown[] | []>(contenders: T, abortSignal?: AbortSignal): Promise<Awaited<T[number]>> => {
    if (abortSignal) {
        return host.race([ abortablePromise(abortSignal), ...contenders ]);
    }

    let deferred: Deferred,
       result = new Promise((resolve, reject) => {
           deferred = { reject, resolve };

           for (let i = 0, n = contenders.length; i < n; i++) {
               let contender = contenders[i];

               // If the contender is a primitive, attempting to use it as a key in the
               // weakmap would throw an error. Luckily, it is safe to call
               // `Promise.resolve(contender).then` on a primitive value multiple times
               // because the promise fulfills immediately.
               if (!isObject(contender)) {
                   Promise.resolve(contender).then(resolve, reject);
                   continue;
               }

               let record = wm.get(contender);

               if (record === undefined) {
                   record = addRaceContender(contender);
                   record.deferreds.add(deferred);
                   wm.set(contender, record);
               }
               // If the value has settled, it is safe to call
               // `Promise.resolve(contender).then` on it.
               else if (record.settled) {
                   Promise.resolve(contender).then(resolve, reject);
               }
               else {
                   record.deferreds.add(deferred);
               }
           }
       })
       // The finally callback executes when any value settles, preventing any of
       // the unresolved values from retaining a reference to the resolved value.
       .finally(() => {
           for (let i = 0, n = contenders.length; i < n; i++) {
               let contender = contenders[i];

               if (!isObject(contender)) {
                   continue;
               }

               wm.get(contender)!.deferreds.delete(deferred);
           }
       });

   return await result as Promise<Awaited<T[number]>>;
};

host.retry = async <T>(fn: () => Promise<T>, config: { delay: number, retries: number } | number): Promise<T | null> => {
    let attempts = 1,
        delay = 0;

    if (typeof config === 'number') {
        delay = config;
    }
    else {
        attempts = config.retries + 1;
        delay = config.delay;
    }

    while (attempts) {
        try {
            return await fn();
        }
        catch {
            attempts--;
            await sleep(delay);
        }
    }

    return null;
};


export default host;