import * as actionTypes from './actionType';
import { CUSTOM_TOKEN } from "../const";

export const apiInitialState = {
    rings: [],
    mixLevel: [],
    startFee: 0,
    distributeFee: 0,
    rate: 0,
    boxInTransaction: 1,
    info: {
        versionMixer: '',
        ergoNode: [],
        ergoExplorer: ''
    },
    tokens: [],
    loadedData: {
        supported: false,
        info: false,
        level: false,
        rings: false
    },
    covertMap: {},
    stealthMap: {},
    activeMap: {},
    historyMap: {},
    covertLoaded: false,
    stealthLoaded: false,
    activeLoaded: false,
    historyLoaded: false,
    sidebarMini: false,
};

export const reducer = (state = apiInitialState, action) => {
    switch (action.type) {
        case actionTypes.STORE_RINGS:
            return {
                ...state,
                rings: action.payload,
                loadedData: {...state.loadedData, rings: true}
            };
        case actionTypes.STORE_LEVELS:
            return {
                ...state,
                mixLevel: action.payload.levels,
                startFee: action.payload.startFee,
                distributeFee: action.payload.distributeFee,
                boxInTransaction: action.payload.boxInTransaction,
                rate: action.payload.rate,
                loadedData: {...state.loadedData, level: true}
            };
        case actionTypes.STORE_INFO:
            return {
                ...state,
                info: action.payload,
                loadedData: {...state.loadedData, info: true}
            }
        case actionTypes.CHANGE_SIDEBAR:
            return {
                ...state,
                sidebarMini: !state.sidebarMini,
            }
        case actionTypes.STORE_SUPPORTED_TOKENS:
            return {
                ...state,
                tokens: [...action.payload, CUSTOM_TOKEN],
                loadedData: {...state.loadedData, supported: true}
            }
        case actionTypes.STEALTH_ADDRESS_MAP:
            return {
                ...state,
                stealthMap: {...action.payload},
                stealthLoaded: true,
            }
        case actionTypes.COVERT_ADDRESS_MAP:
            return {
                ...state,
                covertMap: {...action.payload},
                covertLoaded: true,
            }
        case actionTypes.ACTIVE_MIX_MAP:
            return {
                ...state,
                activeMap: {...action.payload},
                activeLoaded: true,
            }
        case actionTypes.MIX_HISTORY_MAP:
            return {
                ...state,
                historyMap: {...action.payload},
                historyLoaded: true,
            }
        default:
    }
    return state
};

export default reducer;
