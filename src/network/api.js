import axios from 'axios';
// import { TOKEN_KEY } from "../build/constant";

// const BASE_URL = (process.env.BACKEND_URL === undefined ? "/" : process.env.BACKEND_URL);
// const BASE_URL = "http://10.10.10.4:4012/";
const BASE_URL = "/";
const instance = axios.create({baseURL: BASE_URL});

// instance.interceptors.request.use(config => {
//     const token = localStorage.getItem(TOKEN_KEY);
//     if (token) {
//         return {
//             ...config,
//             headers: {
//                 ...config.headers,
//                 Authorization: "Token " + token
//             }
//         }
//     }
//     return config;
// });
//
// instance.interceptors.response.use(response => response, error => {
//     if (error.status === 401) {
//         console.log("Im here with status unauthorized");
//         localStorage.removeItem(TOKEN_KEY);
//     }
//     return Promise.reject(error);
// });

export class ApiNetwork {

    static postJson = (url, data) => {
        return instance({
            method: "POST",
            headers: {"Content-Type": "application/json"},
            url: url,
            data: JSON.stringify(data)
        })
    };

    static getNodeAddress = (nodeAddress, apiKey, addressCount) => {
        return new Promise((resolve, reject) => {
            try {
                ApiNetwork.postJson("address/generate/from_node", {
                    "apiKey": apiKey,
                    "nodeAddress": nodeAddress,
                    "countAddress": addressCount
                }).then(response => {
                    resolve(response);
                }).catch(error => {
                    console.log(error);
                    reject(error);
                });
            } catch (e) {
                console.log(e);
                reject(e);
            }
        })
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
        return new Promise((resolve, reject) => {
            try {
                instance.get("mix/request/completeList").then(response => {
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

    static mixRequestGroupActiveList = () => {
        return new Promise((resolve, reject) => {
            try {
                instance.get("mix/request/activeList").then(response => {
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

    static mixRequestList = groupId => {
        return new Promise((resolve, reject) => {
            try {
                instance.get("mix/request/" + groupId + "/list").then(response => {
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

    static mixLevel = () => {
        return new Promise((resolve, reject) => {
            try {
                instance.get("mix/fee").then(response => {
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

    static rings = () => {
        return new Promise((resolve, reject) => {
            try {
                instance.get("rings").then(response => {
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

    static info = () => {
        return new Promise((resolve, reject) => {
            try {
                instance.get("info").then(response => {
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

    static withdraw = (mixId, withdrawAddress, withdrawNow) => {
        return new Promise((resolve, reject) => {
            try {
                ApiNetwork.postJson("mix/withdraw", {
                    "nonStayAtMix": withdrawNow,
                    "withdrawAddress": withdrawAddress,
                    "mixId": mixId
                }).then(response => {
                    resolve(response);
                }).catch(error => {
                    console.log(error);
                    reject(error);
                });
            } catch (e) {
                console.log(e);
                reject(e);
            }
        })
    }
}

export default instance;
