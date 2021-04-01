/* global BigInt */

import { get } from './rest';
import { getWalletAddress, isWalletSaved } from './helpers';
import { txFee } from './assembler';
import { dollarToCent } from './serializer';
import { currentHeight, getBalanceFor, getUnconfirmedTxsFor } from './explorer';
// import { implementor } from './consts';

let ageusd = import('ageusd');

const considerUnconfirmed = true;
export const implementor = '9f4bRuh6yjhz4wWuz75ihSJwXHrtGXsZiQWUaHSDRf3Da16dMuf';
let bankBox = undefined;
let oracleBox = undefined;

export async function scTokenId() {
    return new (await ageusd).StableCoinProtocol().stablecoin_token_id;
}

export async function rcTokenId() {
    return new (await ageusd).StableCoinProtocol().reservecoin_token_id;
}

export async function bankNFTId() {
    return new (await ageusd).StableCoinProtocol().bank_nft_id;
}

export async function forceUpdateState(bankBoxJson) {
    let age = await ageusd;
    const tokenFromUrl = url => url.split("?")[0].split("/").reverse()[0]
    // const tokenId = age.BankBox.w_explorer_endpoint("").split("?")[0].split("/").reverse()[0];
    let body = bankBoxJson;
    if(bankBoxJson === undefined) {
        body = await get("ageusd/bank/" + tokenFromUrl(age.BankBox.w_explorer_endpoint("")));
    }
    bankBox = age.BankBox.w_process_explorer_response(JSON.stringify({items: [body]}))[0];
    body = JSON.stringify(
        {items: [await get("ageusd/oracle/" + tokenFromUrl(age.ErgUsdOraclePoolBox.w_explorer_endpoint("")))]}
    );
    oracleBox = age.ErgUsdOraclePoolBox.w_process_explorer_response(body)[0];
}

export async function updateState() {
    if (!bankBox || !oracleBox) await forceUpdateState();
}

export async function priceToMintSc(amount) {
    if (dollarToCent(amount) === 0) return 0;

    await updateState();
    return Number(
        bankBox.total_cost_to_mint_stablecoin(
            BigInt(dollarToCent(amount)),
            oracleBox,
            BigInt(await txFee())
        )
    );
}

export async function priceToMintRc(amount) {
    if (parseInt(amount) === 0) return 0;

    await updateState();
    return Number(
        bankBox.total_cost_to_mint_reservecoin(
            BigInt(parseInt(amount)),
            oracleBox,
            BigInt(await txFee())
        )
    );
}

export async function feeToMintSc(amount) {
    if (dollarToCent(amount) === 0) return 0;

    await updateState();
    return Number(
        bankBox.fees_from_minting_stablecoin(
            BigInt(dollarToCent(amount)),
            oracleBox,
            BigInt(await txFee())
        )
    );
}

export async function feeToMintRc(amount) {
    if (parseInt(amount) === 0) return 0;

    await updateState();
    return Number(
        bankBox.fees_from_minting_reservecoin(
            BigInt(parseInt(amount)),
            oracleBox,
            BigInt(await txFee())
        )
    );
}

export async function mintScTx(amount, addr) {
    await updateState();
    let age = await ageusd;
    let height = await currentHeight();
    let pr = new age.StableCoinProtocol();
    let prc = BigInt(await priceToMintSc(amount)) + 1000000n;
    const amountToMint = BigInt(dollarToCent("" + (amount)));
    const txFeeBigInt = BigInt(await txFee());
    let res = pr.w_assembler_mint_stablecoin(
        amountToMint,
        addr,
        txFeeBigInt,
        BigInt(height),
        oracleBox,
        bankBox,
        prc,
        implementor
    );
    res = JSON.parse(res);
    res.requests.splice(3, 1);
    res.requests[1].value += res.requests[2].value
    res.requests.splice(2, 1);
    res.inputs[1] = '$userIns';
    return res;
}

export async function mintRcTx(amount, withdrawAddress) {
    await updateState();
    let age = await ageusd;
    let height = await currentHeight();
    let pr = new age.StableCoinProtocol();
    let prc = BigInt(await priceToMintRc(amount)) + 1000000n;
    let res = pr.w_assembler_mint_reservecoin(
        BigInt(Math.floor(amount)),
        withdrawAddress,
        BigInt(await txFee()),
        BigInt(height),
        oracleBox,
        bankBox,
        prc,
        implementor
    );
    res = JSON.parse(res);
    res.requests.splice(3, 1);
    res.requests[1].value += res.requests[2].value
    res.requests.splice(2, 1);
    res.inputs[1] = '$userIns';
    return res;
}

export async function maxScToMint() {
    if (!bankBox || !oracleBox) await forceUpdateState();
    if (bankBox.current_reserve_ratio(oracleBox) <= 400n) return 0
    return Number(bankBox.num_able_to_mint_stablecoin(oracleBox));
}

export async function maxRcToMint(height) {
    if (!bankBox || !oracleBox) await forceUpdateState();
    // if (bankBox.current_reserve_ratio(oracleBox) >= 800n) return 0
    return Number(bankBox.num_able_to_mint_reservecoin(oracleBox, BigInt(height)));
}

export async function ableScToMint(amount) {
    if (!bankBox || !oracleBox) await forceUpdateState();
    return Number(bankBox.able_to_mint_stablecoin_amount(oracleBox, BigInt(amount)));
}

export async function ableRcToMint(height, amount) {
    if (!bankBox || !oracleBox) await forceUpdateState();
    return Number(bankBox.able_to_mint_reservecoin_amount(oracleBox, BigInt(amount), BigInt(height)));
}

export async function scPrice() {
    if (!bankBox || !oracleBox) await forceUpdateState();
    return Number(bankBox.stablecoin_nominal_price(oracleBox));
}

export function rcPrice() {
    if (!bankBox || !oracleBox) return NaN;
    return Number(bankBox.reservecoin_nominal_price(oracleBox));
}

export async function scNumCirc() {
    if (!bankBox || !oracleBox) await forceUpdateState();
    return Number(bankBox.num_circulating_stablecoins());
}

export async function rcNumCirc() {
    if (!bankBox || !oracleBox) await forceUpdateState();
    return Number(bankBox.num_circulating_reservecoins());
}

export async function scBalance(bal) {
    return bal[await scTokenId()] || 0;
}

export async function rcBalance(bal) {
    return bal[await rcTokenId()] || 0;
}

export async function ergBalance(bal) {
    return bal['erg'] || 0;
}

export function currentReserveRatio() {
    return Number(bankBox.current_reserve_ratio(oracleBox));
}

