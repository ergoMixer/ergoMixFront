import { CUSTOM_TOKEN } from "../const";
import { store } from "../store";

export const ergWithoutSuffix = value => (value / 1e9);

export const erg = value => {
    const valInErg = ergWithoutSuffix(value)
    return (valInErg === 1) ? "1 ERG" : valInErg + " ERG";
};

export const token = (value, tokenId, excludeTokenSuffix=false) => {
    if(value === ''){
        value = 0
    }
    const state = store.getState();
    const tokens = state.tokens;
    let resultToken = CUSTOM_TOKEN;
    tokens.forEach(token => {
        if(token.id === tokenId){
            if(tokenId !== '' || token.type !== 'custom') {
                resultToken = token;
            }
        }
    });
    const res = value / Math.pow(10, resultToken.decimals);
    if(resultToken.type === 'custom'){
        return res + " " + tokenId.substr(0, 5) + (excludeTokenSuffix ? "" : " Token");
    }
    return res + " " + resultToken.name //+ (res > 1 ? "s" : '');
}

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
        if (exp.response.data.message !== undefined) {
            return exp.response.data.message
        }
        return exp.message
    }
}

export const capFirst = msg => {
    try {
        return msg.charAt(0).toUpperCase() + msg.substring(1);
    }catch (e) {
        return '';
    }
}