export default (amount: bigint | number | string, bps: number, max?: bigint | number | string) => {
    amount = Math.ceil( (Number(amount) * bps ) / 10_000 );

    if (max) {
        amount = Math.min(Number(max), amount);
    }

    return amount;
};