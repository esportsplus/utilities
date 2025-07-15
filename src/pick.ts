export default (data: Record<PropertyKey, unknown>, keys: (keyof typeof data)[]) => {
    return Object.fromEntries(
        keys.map(key => [key, data[key]])
    );
};