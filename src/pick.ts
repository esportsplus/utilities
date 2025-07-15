export default <T extends Record<PropertyKey, unknown>>(data: T, keys: (keyof T)[]) => {
    return Object.fromEntries(
        keys.map(key => [key, data[key]])
    );
};