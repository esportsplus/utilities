import { describe, expect, it } from 'vitest';

import number from '~/number';


describe('number', () => {

    describe('abbreviate', () => {

        it('should leave small numbers unchanged', () => {
            expect(number.abbreviate(5)).toBe('5');
        });

        it('should abbreviate thousands', () => {
            expect(number.abbreviate(1500)).toBe('1.5K');
        });

        it('should abbreviate millions', () => {
            expect(number.abbreviate(2000000)).toBe('2M');
        });

    });

    describe('ordinal', () => {

        it('should return "st" for 1', () => {
            expect(number.ordinal(1)).toBe('st');
        });

        it('should return "nd" for 2', () => {
            expect(number.ordinal(2)).toBe('nd');
        });

        it('should return "rd" for 3', () => {
            expect(number.ordinal(3)).toBe('rd');
        });

        it('should return "th" for 4', () => {
            expect(number.ordinal(4)).toBe('th');
        });

        it('should return "th" for 11', () => {
            expect(number.ordinal(11)).toBe('th');
        });

        it('should return "th" for 12', () => {
            expect(number.ordinal(12)).toBe('th');
        });

        it('should return "th" for 13', () => {
            expect(number.ordinal(13)).toBe('th');
        });

        it('should return "st" for 21', () => {
            expect(number.ordinal(21)).toBe('st');
        });

        it('should return "nd" for 22', () => {
            expect(number.ordinal(22)).toBe('nd');
        });

        it('should return "st" for 101', () => {
            expect(number.ordinal(101)).toBe('st');
        });

    });

});
