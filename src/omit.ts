export default <T extends Record<PropertyKey, unknown>, K extends keyof T>(data: T, omit: K[]) => {
    let keys = Object.keys(data),
        response: Record<PropertyKey, unknown> = {};

    for (let i = 0; i < keys.length; i++) {
        let key = keys[i];

        if (omit.indexOf(key as K) !== -1) {
            continue;
        }

        response[key] = data[key];
    }

    return response as Omit<T, K>;
};