export const RINGS = [
    {amount: 1e9, unspentHalfBox: 0, spentHalfBox: 0},
    {amount: 10e9, unspentHalfBox: 0, spentHalfBox: 0},
    {amount: 100e9, unspentHalfBox: 0, spentHalfBox: 0},
];


export const CUSTOM_TOKEN = {
    id: "",
    name: "Custom Token",
    rings: [200, 1000, 5000],
    decimals: 0,
    type: "custom",
}

export const TOKEN_ERGO_AMOUNT = 1000000

export const getToken = tokenId => {
    let res = CUSTOM_TOKEN;
    // TOKENS.forEach(token => {
    //     if(token.hash === tokenId){
    //         res = token;
    //     }
    // });
    return res;
}

export const COVERT_NAME_SIZE = 30;