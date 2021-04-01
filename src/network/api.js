import axios from 'axios';
import { saveActiveMixMap, saveCovertMap, saveMixHistoryMap } from "../store/action";
import { store } from "../store";

// const DEFAULT_BASE_URL = "http://10.10.10.4:9000";
const DEFAULT_BASE_URL = "/";
export const BASE_URL = (window.backend === undefined ?  DEFAULT_BASE_URL : window.backend);
// export const BASE_URL = "/";
const instance = axios.create({baseURL: BASE_URL});

export class ApiNetwork {

    static createPromise = (promise,
                            processResult = response => response,
                            processError = error => error) => {
        return new Promise((resolve, reject) => {
            try {
                promise.then(response => {
                    const result = processResult(response);
                    resolve(result);
                }).catch(error => {
                    const errorResponse = processError(error);
                    console.log(error);
                    reject(errorResponse);
                })
            } catch (error) {
                const errorResponse = processError(error);
                console.log(errorResponse);
                reject(errorResponse);
            }
        });
    }

    static postJson = (url, data) => {
        return instance({
            method: "POST",
            headers: {"Content-Type": "application/json"},
            url: url,
            data: JSON.stringify(data)
        })
    };

    static getNodeAddress = (nodeAddress, apiKey, addressCount) => {
        return this.createPromise(ApiNetwork.postJson("address/generate/from_node", {
            "apiKey": apiKey,
            "nodeAddress": nodeAddress,
            "countAddress": addressCount
        }));
    };

    static mixRequest = addresses => {
        return new Promise((resolve, reject) => {
            try {
                const requestAddress = addresses.map(item => {
                    return {...item, amount: item.amount}
                });
                ApiNetwork.postJson("mix/request", requestAddress).then(response => {
                    resolve(response);
                }).catch(error => {
                    console.log(error);
                    reject(error);
                });
            } catch (e) {
                console.log(e);
                reject(e);
            }
        });
    };

    static covertRequest = covert => {
        return this.createPromise(ApiNetwork.postJson("covert", covert));
    };

    static covertList = () => {
        return this.createPromise(instance.get("covert/list"), response => {
            let covertMap = {}
            response.data.forEach(item => {
                covertMap[item.id] = item.deposit;
            });
            store.dispatch(saveCovertMap(covertMap));
            return response;
        });
    }

    static covertAsset = covertId => {
        return this.createPromise(instance.get('covert/' + covertId + "/asset"));
    }

    static covertName = (covertId, name) => {
        return this.createPromise(instance.post('covert/' + covertId + "/name", {
            "nameCovert": name
        }));
    }

    static covertAssetSet = (covertId, tokenId, ring) => {
        return this.createPromise(ApiNetwork.postJson('covert/' + covertId + '/asset', {tokenId: tokenId, ring: ring}));
    }

    static mixRequestGroupCompleteList = () => {
        return this.createPromise(instance.get("mix/request/completeList"), response => {
            let mixMap = {}
            response.data.forEach(item => {
                mixMap[item.id] = item.deposit;
            });
            store.dispatch(saveMixHistoryMap(mixMap));
            return response;
        });
    };

    static mixRequestGroupActiveList = () => {
        return this.createPromise(instance.get("mix/request/activeList"), response => {
            let mixMap = {}
            response.data.forEach(item => {
                mixMap[item.id] = item.deposit;
            });
            store.dispatch(saveActiveMixMap(mixMap));
            return response;
        });
    };

    static mixRequestList = (groupId, status) => {
        const queryString = status !== undefined ? "?status=" + status : '';
        return this.createPromise(instance.get("mix/request/" + groupId + "/list" + queryString));
    };

    static mixLevel = () => {
        return this.createPromise(instance.get("mix/fee"));
    };

    static rings = () => {
        return this.createPromise(instance.get("rings"));
    };

    static supportedTokens = () => {
        return this.createPromise(instance.get("mix/supported"))
    }

    static info = () => {
        return this.createPromise(instance.get("info"));
    };

    static shutdown = () => {
        return this.createPromise(ApiNetwork.postJson("exit", {}));
    };

    static withdraw = (mixId, withdrawAddress, withdrawNow) => {
        return this.createPromise(ApiNetwork.postJson("mix/withdraw", {
            "nonStayAtMix": withdrawNow,
            "withdrawAddress": withdrawAddress,
            "mixId": mixId
        }));
    }

    static getCovertAddress = covertId => {
        return this.createPromise(instance.get("covert/" + covertId + "/address"))
    }

    static setCovertAddress = (covertId, addresses) => {
        return this.createPromise(this.postJson("covert/" + covertId + "/address", {addresses: addresses}))
    }

    static restore = formData => {
        return ApiNetwork.createPromise(instance.post('restore', formData));
    }

    static mint = (boxId, oldTransaction, request) => {
        return ApiNetwork.createPromise(instance.post('ageusd/mint', {'boxId': boxId, 'oldTransaction': oldTransaction, 'request': request}));
    }

    static fee = () => {
        return ApiNetwork.createPromise(instance.get('ageusd/fee'));
    }
}

export default instance;
