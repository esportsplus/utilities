export default async (ms?: number) => {
    if (!ms) {
        return;
    }

    return new Promise(resolve => setTimeout(resolve, ms));
};