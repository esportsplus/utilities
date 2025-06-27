export default {
    center: (str: string, { prefix, suffix }: { prefix?: number, suffix?: number } = {}) => {
        return str.slice(0, prefix || 5) + '...' + str.slice(str.length - (suffix || 7));
    },
    end: (str: string, prefix: number = 7) => {
        return str.slice(0, prefix) + '...';
    },
    start: (str: string, suffix: number = 7) => {
        return '...' + str.slice(str.length - suffix);
    }
};