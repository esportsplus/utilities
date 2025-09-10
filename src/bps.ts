import { Amount, BIPS } from './types';


const PRECISION_FACTOR = 1_000_000_000;


function bps(amount: bigint, bps: bigint | number | string): bigint;
function bps(amount: number | string, bps: bigint | number | string): number;
function bps(amount: bigint | number | string, bps: bigint | number | string): bigint | number {
    bps = BigInt(bps);

    if (bps === 0n) {
        return typeof amount === 'bigint' ? 0n : 0;
    }

    if (typeof amount === 'bigint') {
        return amount * bps / 10_000n;
    }

    amount = Number(amount);

    if (amount === 0) {
        return 0;
    }

    amount = Math.round(amount * PRECISION_FACTOR);
    amount = BigInt(amount) * bps / 10_000n;

    return Number(amount) / PRECISION_FACTOR;
}

bps.toDisplay = (amount: Amount) => {
    if ('display' in amount) {
        return Number(amount.display);
    }

    return (Number(amount.raw) / 100);
};

bps.toRaw = (amount: Amount): BIPS => {
    if ('raw' in amount) {
        return Number(amount.raw) as BIPS;
    }

    return Math.min(Number(amount.display) * 100, 10_000) as BIPS;
};


export default bps;