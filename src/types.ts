type Amount = { display: number | string } | { raw: bigint | number | string };

type BIPS = Brand<number, 'BIPS'>;

type Brand<T, B extends string> = T & { __brand: B };

type DeepReadonly<T> = T extends (...args: unknown[]) => unknown
    ? T
    : T extends Array<infer R>
        ? ReadonlyArray<DeepReadonly<R>>
        : T extends object
            ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
            : T;

type Function = (...args: unknown[]) => (Promise<unknown> | unknown);

type NeverAsync<T> =
    T extends Promise<unknown>
        ? never
        : T extends (...args: unknown[]) => infer R
            ? NeverAsync<R>
            : T;

type NeverFunction<T> =
    T extends Promise<unknown>
        ? never
        : T extends Function
            ? never
            : T;

type Prettify<T> = {
    [K in keyof T]: T[K];
} & {};

type Primitive = bigint | boolean | null | number | string | undefined;

type ULID = Brand<string, 'ULID'>;

type UnionRecord<U, V extends Record<string, unknown>> = Prettify<U & { [K in keyof U]?: undefined } & V>;

type UUID = Brand<string, 'UUID'>;


export type {
    Amount,
    BIPS, Brand,
    DeepReadonly,
    Function,
    NeverAsync, NeverFunction,
    Prettify, Primitive,
    ULID, UnionRecord, UUID
};