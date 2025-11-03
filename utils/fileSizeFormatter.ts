export function fileSizeFormatter(size: number, decimals: number = 2) {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let unitIndex = 0;

    while (size >= 100 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
    }

    return size.toFixed(decimals) + ' ' + units[unitIndex];
}