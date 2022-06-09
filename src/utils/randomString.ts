export const randomString = (length: number) => {
    let result = '';
    const charcters = '0987654321';
    const charactersLength = charcters.length;
    for(let i = 0; i < length; i++){
        result += charcters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}