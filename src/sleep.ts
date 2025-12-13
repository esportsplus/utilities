export default (ms?: number) => {
    if (!ms) {
        return Promise.resolve();
    }

    return new Promise<void>(resolve => setTimeout(resolve, ms));
};