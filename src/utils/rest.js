import { BASE_URL } from "../network/api";

const makeUrl = url => {
    if(url.startsWith("http")){
        return url
    }
    if(url.startsWith("/")){
        return BASE_URL + url.substr(1)
    }
    return BASE_URL + url;
}

export async function post(url, body = {}, apiKey = '') {
    return await fetch(makeUrl(url), {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            api_key: apiKey,
        },
        body: JSON.stringify(body),
    });
}

export async function get(url, apiKey = '') {
    return await fetch(makeUrl(url), {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            api_key: apiKey,
        },
    }).then(res => res.json());
}
