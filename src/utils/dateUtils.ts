export function getCurrentDateString(): string {
    return new Date().toISOString().slice(0, 10);
}