export default <T>(items: T[], size: number) => {
    let n = items.length;

    if (size <= 0 || n <= size) {
        return [items];
    }

    let chunks: T[][] = [];

    for (let i = 0; i < n; i += size) {
        chunks.push( items.slice(i, i + size) );
    }

    return chunks;
};