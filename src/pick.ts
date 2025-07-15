export default <T extends Record<PropertyKey, unknown>, K extends keyof T>(data: T, pick: K[]) => {
    let response = {} as Pick<T, K>;

    for (let i = 0; i < pick.length; i++) {
        let key = pick[i];

        response[key] = data[key];
    }

    return response;
};