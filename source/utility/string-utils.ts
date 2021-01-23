
const convertStringArrayToLower = (arr: string[]): string[] => {
    return arr.map((item: string) => { return item.toString().toLowerCase() });
}

export {
    convertStringArrayToLower
}