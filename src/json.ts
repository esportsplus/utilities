let replacer = (_: string, value: unknown) => {
    if (typeof value === 'bigint') {
        return value.toString();
    }

    return value;
};


const { parse } = JSON;

const stringify = (value: unknown, space?: number | string) => JSON.stringify(value, replacer, space);


export { parse, stringify };