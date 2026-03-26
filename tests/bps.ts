import { describe, expect, it } from 'vitest';

import bps from '~/bps';


describe('bps', () => {

    describe('bigint overload', () => {

        it('10000n at 500 bps (5%) returns 500n', () => {
            expect(bps(10_000n, 500)).toBe(500n);
        });

        it('10000n at 10000 bps (100%) returns 10000n', () => {
            expect(bps(10_000n, 10_000)).toBe(10_000n);
        });

        it('10000n at 0 bps returns 0n', () => {
            expect(bps(10_000n, 0)).toBe(0n);
        });

        it('0n at 500 bps returns 0n', () => {
            expect(bps(0n, 500)).toBe(0n);
        });

    });


    describe('number overload', () => {

        it('100 at 500 bps (5%) returns 5', () => {
            expect(bps(100, 500)).toBe(5);
        });

        it('100 at 10000 bps (100%) returns 100', () => {
            expect(bps(100, 10_000)).toBe(100);
        });

        it('100 at 0 bps returns 0', () => {
            expect(bps(100, 0)).toBe(0);
        });

        it('0 at 500 bps returns 0', () => {
            expect(bps(0, 500)).toBe(0);
        });

        it('string amount "100" at 500 bps returns 5', () => {
            expect(bps('100', 500)).toBe(5);
        });

    });


    describe('toDisplay', () => {

        it('{ display: 5 } returns 5', () => {
            expect(bps.toDisplay({ display: 5 })).toBe(5);
        });

        it('{ display: "5" } returns 5', () => {
            expect(bps.toDisplay({ display: '5' })).toBe(5);
        });

        it('{ raw: 500 } returns 5', () => {
            expect(bps.toDisplay({ raw: 500 })).toBe(5);
        });

    });


    describe('toRaw', () => {

        it('{ raw: 500 } returns 500', () => {
            expect(bps.toRaw({ raw: 500 })).toBe(500);
        });

        it('{ raw: "500" } returns 500', () => {
            expect(bps.toRaw({ raw: '500' })).toBe(500);
        });

        it('{ display: 5 } returns 500', () => {
            expect(bps.toRaw({ display: 5 })).toBe(500);
        });

        it('{ display: 200 } clamps to 10000', () => {
            expect(bps.toRaw({ display: 200 })).toBe(10_000);
        });

    });

});
