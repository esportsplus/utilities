export default <T>(items: T[], size: number) => {
    let n = items.length;

    if (n <= size) {
        return [items];
    }

    let chunks: T[][] = [];

    for (let i = 0; i < n; i += size) {
        chunks.push( items.slice(i, i + size) );
    }

    return chunks;
};