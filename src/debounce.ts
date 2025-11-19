export default (fn: VoidFunction, delay: number) => {
    let timer: ReturnType<typeof setTimeout>;

    return () => {
        clearTimeout(timer);
        timer = setTimeout(fn, delay);
    };
};