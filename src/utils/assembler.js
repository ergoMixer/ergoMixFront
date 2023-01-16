import { ApiNetwork } from "../network/api";
import * as wasm from "ergo-lib-wasm-browser";

let feeJson = {
    value: null,
    lastLoaded: 0,
}

export async function txFee() {
    if((Date.now() - feeJson.lastLoaded) > 10000){
        feeJson.value = null;
    }
    if(feeJson.value === null) {
        const res = (await ApiNetwork.fee()).data;
        feeJson.lastLoaded = Date.now();
        feeJson.value = res.fee === undefined ? 2000000 : res.fee;
    }
    return feeJson.value
}

export async function getUserBoxData (mixId) {
    const userDataJson = await ApiNetwork.getMixBox(mixId)
    const userBox = wasm.ErgoBox.from_json(
        JSON.stringify(userDataJson.box)
    )
    const burnTokens = new wasm.Tokens()
    userDataJson.burnTokens.forEach(asset => {
        burnTokens.add(
            new wasm.Token(
                wasm.TokenId.from_str(asset.tokenId),
                wasm.TokenAmount.from_i64(
                    wasm.I64.from_str(asset.amount.toString())
                )
            )
        )
    })
    return {
        box: userBox,
        burnTokens: burnTokens
    }
}

export const getNetworkContext = async () => {
    const blocks = (await ApiNetwork.getLastBlocks(10)).blocks
    const blockHeaders = wasm.BlockHeaders.from_json(blocks.reverse());
    const pre_header = wasm.PreHeader.from_block_header(blockHeaders.get(0));
    return new wasm.ErgoStateContext(pre_header, blockHeaders);
}

