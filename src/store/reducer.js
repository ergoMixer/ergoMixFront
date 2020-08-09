import * as actionTypes from './actionType';
import { RINGS } from "../const";

export const apiInitialState = {
    rings: [...RINGS],
    mixLevel: [],
    fee: 0,
    rate: 0,
    boxInTransaction: 1,
    info: {
        versionMixer: '',
        ergoNode: '',
        ergoExplorer: ''
    }
};

export const reducer = (state = apiInitialState, action) => {
    switch (action.type) {
        case actionTypes.STORE_RINGS:
            return {
                ...state,
                rings: action.payload
            };
        case actionTypes.STORE_LEVELS:
            return {
                ...state,
                mixLevel: action.payload.levels,
                fee: action.payload.fee,
                boxInTransaction: action.payload.boxInTransaction,
                rate: action.payload.rate
            };
        case actionTypes.STORE_INFO:
            return {
                ...state,
                info: action.payload
            }
        default:
    }
    return state
};

export default reducer;
