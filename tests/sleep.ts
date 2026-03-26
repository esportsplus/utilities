import { describe, expect, it, vi } from 'vitest';

import sleep from '~/sleep';


describe('sleep', () => {

    it('should resolve immediately with no argument', async () => {
        let result = await sleep();

        expect(result).toBeUndefined();
    });

    it('should resolve immediately with 0', async () => {
        let result = await sleep(0);

        expect(result).toBeUndefined();
    });

    it('should resolve after specified delay', async () => {
        vi.useFakeTimers();

        let resolved = false;

        sleep(100).then(() => { resolved = true; });

        expect(resolved).toBe(false);

        await vi.advanceTimersByTimeAsync(99);
        expect(resolved).toBe(false);

        await vi.advanceTimersByTimeAsync(1);
        expect(resolved).toBe(true);

        vi.useRealTimers();
    });

});
