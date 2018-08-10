export function* entries(obj: any) {
    for (const key of Object.keys(obj)) {
        yield [key, obj[key]];
    }
}
