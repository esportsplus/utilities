import { isArray } from '.';


type Response<T> = T extends undefined | null
    ? NonNullable<T>[]
    : T extends readonly unknown[]
        ? T
        : T[];


export default <T>(input: T) => {
    if (input == undefined) {
        return [] as Response<T>;
    }

    if (isArray(input)) {
        return input as Response<T>;
    }

    return [input] as Response<T>;
};