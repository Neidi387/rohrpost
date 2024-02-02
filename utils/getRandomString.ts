export function getRandomString(len: number) {
    let address = '';
    for (let i = 0; i < len; i++) {
        const num = Math.floor( 65 + Math.random() * 26);
        const letter = String.fromCharCode(num);
        address += letter;
    }
    return address;
}