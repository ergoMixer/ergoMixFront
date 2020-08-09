import * as actionTypes from './actionType';
import { ApiNetwork } from '../network/api';
import { RINGS } from "../const";

export const loadRingsAsync = () => {
    return dispatch => {
        const getData = () => {
            ApiNetwork.rings().then(response => {
                setTimeout(getData, 10 * 60 * 1000);
                dispatch({
                    type: actionTypes.STORE_RINGS,
                    payload: response.data
                });
            }).catch(error => {
                setTimeout(getData, 10 * 1000);
            });
        };
        getData();
    }
};

export const loadInfoAsync = () => {
    return dispatch => {
        const getData = () => {
            ApiNetwork.info().then(response => {
                setTimeout(getData, 10 * 60 * 1000);
                dispatch({
                    type: actionTypes.STORE_INFO,
                    payload: {...response.data}
                });
            }).catch(error => {
                setTimeout(getData, 10 * 1000);
            });
        };
        getData();
    }
};

export const loadMixLevelAsync = () => {
    return dispatch => {
        const getData = () => {
            ApiNetwork.mixLevel().then(response => {
                setTimeout(getData, 10 * 60 * 1000);
                let data = {
                    startFee: 0,
                    distributeFee: 0,
                    boxInTransaction: 1,
                    levels: []
                };
                Object.keys(response.data).forEach(key => {
                    if (key === "startFee" || key === "distributeFee" || key === "boxInTransaction" || key === "rate") {
                        data[key] = response.data[key];
                    } else if (!isNaN(key)) {
                        data.levels.push({price: response.data[key], token: parseInt(key)})
                    }
                });
                dispatch({
                    type: actionTypes.STORE_LEVELS,
                    payload: {
                        ...data
                    }
                });
            }).catch(error => {
                setTimeout(getData, 10 * 1000);
            });
        };
        getData();
    }
};

export const loadSupportedTokensAsync = () => {
    return dispatch => {
        const getData = () => {
            ApiNetwork.supportedTokens().then(response => {
                setTimeout(getData, 10 * 60 * 1000);
                dispatch({
                    type: actionTypes.STORE_SUPPORTED_TOKENS,
                    payload: response.data.map(item => {
                        return {...item, type: 'defined'}
                    })
                });
            }).catch(error => {
                setTimeout(getData, 10 * 1000);
            });
        };
        getData();
    }
}