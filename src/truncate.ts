export default {
    center: (str: string, { prefix = 5, suffix = 7 }: { prefix?: number, suffix?: number } = {}) => {
        if (str.length <= prefix + suffix + 3) {
            return str;
        }

        return str.slice(0, prefix) + '...' + str.slice(str.length - suffix);
    },
    end: (str: string, prefix: number = 7) => {
        return str.slice(0, prefix) + '...';
    },
    start: (str: string, suffix: number = 7) => {
        return '...' + str.slice(str.length - suffix);
    }
};