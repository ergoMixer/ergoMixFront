import { ergToNano } from './serializer';
import {  forceUpdateState, mintScTx, priceToMintSc } from './ageHelper';
import { ergSendPrecision } from './consts';

export async function mintSc(amount, withdrawAddress, bankBox) {
    await forceUpdateState(bankBox)
    let befPrice = await priceToMintSc(amount) + 1000000
    let price = (befPrice / 1e9).toFixed(ergSendPrecision)
    price = ergToNano(price)
    if (price<befPrice) price += 10 ** (9 - ergSendPrecision)
    return await mintScTx(amount, withdrawAddress)
}
