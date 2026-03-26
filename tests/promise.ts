import { describe, expect, it, vi } from 'vitest';

import promise from '~/promise';


describe('promise', () => {

    describe('host()', () => {

        it('should return the promise directly when no abort signal is provided', () => {
            let p = Promise.resolve('value');

            expect(promise(p)).toBe(p);
        });

        it('should resolve with value when promise resolves before abort', async () => {
            let controller = new AbortController(),
                result = await promise(Promise.resolve('resolved'), controller.signal);

            expect(result).toBe('resolved');
        });

        it('should reject when abort signal fires before promise resolves', async () => {
            let controller = new AbortController(),
                pending = new Promise(() => {}),
                raced = promise(pending, controller.signal);

            controller.abort(new Error('aborted'));

            await expect(raced).rejects.toThrow('aborted');
        });

        it('should reject immediately if signal is already aborted', async () => {
            let pending = new Promise(() => {});

            await expect(promise(pending, AbortSignal.abort('pre-aborted'))).rejects.toBe('pre-aborted');
        });

    });


    describe('host.race()', () => {

        it('should resolve with the first settled value', async () => {
            let fast = Promise.resolve('fast'),
                slow = new Promise((resolve) => setTimeout(resolve, 1000, 'slow'));

            let result = await promise.race([fast, slow]);

            expect(result).toBe('fast');
        });

        it('should work with primitive values', async () => {
            let result = await promise.race([42, Promise.resolve('slow')]);

            expect(result).toBe(42);
        });

        it('should reject if the first to settle rejects', async () => {
            let fast = Promise.reject(new Error('fail')),
                slow = new Promise((resolve) => setTimeout(resolve, 1000, 'slow'));

            await expect(promise.race([fast, slow])).rejects.toThrow('fail');
        });

        it('should support abort signal parameter', async () => {
            let controller = new AbortController(),
                slow1 = new Promise(() => {}),
                slow2 = new Promise(() => {});

            let raced = promise.race([slow1, slow2], controller.signal);

            controller.abort(new Error('race-aborted'));

            await expect(raced).rejects.toThrow('race-aborted');
        });

        it('should clean up deferreds after settlement', async () => {
            let resolve1!: (v: string) => void,
                resolve2!: (v: string) => void;

            let p1 = new Promise<string>((r) => { resolve1 = r; }),
                p2 = new Promise<string>((r) => { resolve2 = r; });

            let raced = promise.race([p1, p2]);

            resolve1('winner');

            let result = await raced;

            expect(result).toBe('winner');

            // Settle p2 so it doesn't leak
            resolve2('done');
        });

    });


    describe('host.retry()', () => {

        it('should return value on first success', async () => {
            let result = await promise.retry(() => Promise.resolve('ok'), { delay: 0, retries: 3 });

            expect(result).toBe('ok');
        });

        it('should retry and return value on eventual success', async () => {
            let calls = 0;

            let fn = () => {
                calls++;

                if (calls < 3) {
                    return Promise.reject(new Error('not yet'));
                }

                return Promise.resolve('success');
            };

            let result = await promise.retry(fn, { delay: 0, retries: 4 });

            expect(result).toBe('success');
            expect(calls).toBe(3);
        });

        it('should return null after all retries exhausted', async () => {
            let fn = () => Promise.reject(new Error('always fails'));

            let result = await promise.retry(fn, { delay: 0, retries: 2 });

            expect(result).toBeNull();
        });

        it('should treat config as delay with 1 attempt when config is a number', async () => {
            let calls = 0;

            let fn = () => {
                calls++;
                return Promise.reject(new Error('fail'));
            };

            let result = await promise.retry(fn, 0);

            expect(result).toBeNull();
            expect(calls).toBe(1);
        });

        it('should use delay and retries from config object', async () => {
            vi.useFakeTimers();

            let calls = 0;

            let fn = () => {
                calls++;
                return Promise.reject(new Error('fail'));
            };

            let pending = promise.retry(fn, { delay: 100, retries: 2 });

            // First call happens immediately, fails, then sleeps
            await vi.advanceTimersByTimeAsync(100);
            // Second call fails, then sleeps
            await vi.advanceTimersByTimeAsync(100);
            // Third call fails, then sleeps
            await vi.advanceTimersByTimeAsync(100);

            let result = await pending;

            expect(result).toBeNull();
            expect(calls).toBe(3);

            vi.useRealTimers();
        });

        it('should call function exactly retries + 1 times', async () => {
            let calls = 0;

            let fn = () => {
                calls++;
                return Promise.reject(new Error('fail'));
            };

            await promise.retry(fn, { delay: 0, retries: 4 });

            expect(calls).toBe(5);
        });

    });

});
