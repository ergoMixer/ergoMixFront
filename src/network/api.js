import axios from 'axios';
// const BASE_URL = "http://10.10.10.4:9000/";
const BASE_URL = "/";
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

    static mixRequestGroupCompleteList = () => {
        return this.createPromise(instance.get("mix/request/completeList"));
    };

    static mixRequestGroupActiveList = () => {
        return this.createPromise(instance.get("mix/request/activeList"));
    };

    static mixRequestList = groupId => {
        return this.createPromise(instance.get("mix/request/" + groupId + "/list"));
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

    static withdraw = (mixId, withdrawAddress, withdrawNow) => {
        return this.createPromise(ApiNetwork.postJson("mix/withdraw", {
            "nonStayAtMix": withdrawNow,
            "withdrawAddress": withdrawAddress,
            "mixId": mixId
        }));
    }
}

export default instance;
