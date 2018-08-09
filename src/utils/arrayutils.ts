export function* entries(obj: any){
    for (let key of Object.keys(obj)) {
        yield [key, obj[key]];
    }
}