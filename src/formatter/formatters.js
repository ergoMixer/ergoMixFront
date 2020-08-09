export const ergWithoutSuffix = value => (value / 1e9);
export const erg = value => {
    const valInErg = ergWithoutSuffix(value)
    return (valInErg === 1) ? "1 Erg" : valInErg + " Ergs";
};
export const id = value => {
    if (value.length > 5) {
        return value.substr(0, 5) + '...'
    } else {
        return value
    }
}

export const errorMessage = exp => {
    try {
        const data = JSON.parse(exp.response.data)
        return data.message
    } catch (e) {
        if (exp.response.data.message !== undefined){
            return exp.response.data.message
        }
        return exp.message
    }
}