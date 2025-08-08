const NON_WORDS = /\W+/g;

const TRAILING_DASHES = /-+$/;


export default (value: string) => {
    return value.replace(NON_WORDS, '-').replace(TRAILING_DASHES, '').toLowerCase();
};