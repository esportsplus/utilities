import { isArray } from '.';

type Arrayify<T> = T extends readonly unknown[] ? T : T[];

export default <T>(input: T): Arrayify<T> => {
    if (input == undefined) {
        return [] as Arrayify<T>;
    }

    if (isArray(input)) {
        return input as Arrayify<T>;
    }

    return [input] as Arrayify<T>;
};