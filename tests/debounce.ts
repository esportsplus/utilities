import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import debounce from '~/debounce';


describe('debounce', () => {

    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('should not call function immediately', () => {
        let fn = vi.fn();
        let debounced = debounce(fn, 100);

        debounced();

        expect(fn).not.toHaveBeenCalled();
    });

    it('should call function after delay', () => {
        let fn = vi.fn();
        let debounced = debounce(fn, 100);

        debounced();
        vi.advanceTimersByTime(100);

        expect(fn).toHaveBeenCalledOnce();
    });

    it('should reset timer on subsequent calls', () => {
        let fn = vi.fn();
        let debounced = debounce(fn, 100);

        debounced();
        vi.advanceTimersByTime(80);
        debounced();
        vi.advanceTimersByTime(80);

        expect(fn).not.toHaveBeenCalled();

        vi.advanceTimersByTime(20);

        expect(fn).toHaveBeenCalledOnce();
    });

    it('should pass arguments through', () => {
        let fn = vi.fn();
        let debounced = debounce(fn, 100);

        debounced('a', 42);
        vi.advanceTimersByTime(100);

        expect(fn).toHaveBeenCalledWith('a', 42);
    });

    it('should only execute last call when called multiple times', () => {
        let fn = vi.fn();
        let debounced = debounce(fn, 100);

        debounced('first');
        debounced('second');
        debounced('third');
        vi.advanceTimersByTime(100);

        expect(fn).toHaveBeenCalledOnce();
        expect(fn).toHaveBeenCalledWith('third');
    });

});
