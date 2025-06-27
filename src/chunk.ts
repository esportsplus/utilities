export default <T>(items: T[], size: number) => {
    if (items.length <= size) {
        return [items];
    }

    return Array.from(
        { length: Math.ceil(items.length / size) },
        (_, i) => items.slice(i * size, i * size + size)
    );
};